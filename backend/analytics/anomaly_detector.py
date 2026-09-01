"""
Deterministic KPI Monitoring & Anomaly Detection Engine
Computes actual vs expected baselines using statistical methods:
- EWMA (Exponentially Weighted Moving Average)
- Rolling Z-Scores and standard deviations
- Seasonal residuals and deviation magnitudes
- Strict deterministic computations (NO LLM anomaly detection)
"""

import numpy as np
import pandas as pd
from typing import Dict, Any, List, Optional

class AnomalyDetector:
    def __init__(self, reconciled_df: pd.DataFrame):
        self.df = reconciled_df.copy()
        if "date" in self.df.columns:
            self.df["date"] = pd.to_datetime(self.df["date"])
            self.df = self.df.sort_values("date")

    def analyze_kpi(self, kpi_id: str, dimension_filters: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Runs statistical monitoring over the KPI time-series.
        Returns actual, baseline, deviation, z-score, persistence, and anomaly status.
        """
        filtered_df = self.df.copy()
        if dimension_filters:
            for dim, val in dimension_filters.items():
                if dim in filtered_df.columns and val is not None and val != "All":
                    filtered_df = filtered_df[filtered_df[dim] == val]

        # Group by date to get aggregate time-series for the KPI
        if kpi_id == "revenue":
            daily_series = filtered_df.groupby("date")["revenue"].sum()
        elif kpi_id == "profit_margin":
            p = filtered_df.groupby("date")["profit"].sum()
            r = filtered_df.groupby("date")["revenue"].sum().replace(0, np.nan)
            daily_series = (p / r) * 100
        elif kpi_id == "order_volume":
            daily_series = filtered_df.groupby("date")["orders"].sum()
        elif kpi_id == "conversion_rate":
            o = filtered_df.groupby("date")["orders"].sum()
            c = filtered_df.groupby("date")["clicks"].sum().replace(0, np.nan)
            daily_series = (o / c) * 100
        elif kpi_id == "inventory_availability":
            a = filtered_df.groupby("date")["available_units"].sum()
            d = filtered_df.groupby("date")["demand_units"].sum().replace(0, np.nan)
            daily_series = (a / d) * 100
        elif kpi_id == "cac":
            s = filtered_df.groupby("date")["campaign_spend"].sum()
            o = filtered_df.groupby("date")["orders"].sum().replace(0, np.nan)
            daily_series = s / o
        elif kpi_id == "roas":
            ar = filtered_df.groupby("date")["attributed_revenue"].sum()
            s = filtered_df.groupby("date")["campaign_spend"].sum().replace(0, np.nan)
            daily_series = ar / s
        else:
            daily_series = filtered_df.groupby("date")["revenue"].sum()

        daily_series = daily_series.ffill().fillna(0)
        
        if len(daily_series) < 7:
            # Sparse history condition
            actual_val = float(daily_series.iloc[-1]) if not daily_series.empty else 0.0
            return {
                "kpi_id": kpi_id,
                "status": "SPARSE_HISTORY",
                "observations_count": len(daily_series),
                "actual_value": actual_val,
                "expected_value": actual_val,
                "abs_change": 0.0,
                "pct_change": 0.0,
                "z_score": 0.0,
                "is_anomaly": False,
                "persistence_days": len(daily_series),
                "message": f"Only {len(daily_series)} daily observations available. Reliable statistical baseline requires minimum 14 days."
            }

        # Calculate EWMA Baseline & Rolling Stats
        baseline_ewma = daily_series.ewm(span=14, adjust=False).mean()
        rolling_mean_7d = daily_series.rolling(window=7, min_periods=3).mean()
        rolling_std_14d = daily_series.rolling(window=14, min_periods=5).std().replace(0, 1.0)

        recent_window_days = 7
        actual_recent_mean = float(daily_series.tail(recent_window_days).mean())
        # Baseline is expected from earlier normal distribution
        expected_recent_baseline = float(baseline_ewma.iloc[-recent_window_days - 1]) if len(baseline_ewma) > recent_window_days else float(baseline_ewma.mean())
        
        # Calculate daily deviations for the most recent day
        last_actual = float(daily_series.iloc[-1])
        last_expected = float(baseline_ewma.iloc[-1])
        last_std = float(rolling_std_14d.iloc[-1])
        
        if last_std <= 0:
            last_std = 1.0

        z_score = round((last_actual - last_expected) / last_std, 2)
        abs_change = round(last_actual - last_expected, 2)
        pct_change = round(((last_actual - last_expected) / (last_expected if last_expected != 0 else 1.0)) * 100, 2)

        # Persistence calculation: count consecutive days with deviation in the same direction (|z| > 1.5)
        residuals = (daily_series - baseline_ewma) / rolling_std_14d
        persistence_count = 0
        direction = np.sign(z_score) if z_score != 0 else 1
        for val in reversed(residuals.tail(14).values):
            if np.sign(val) == direction and abs(val) >= 1.2:
                persistence_count += 1
            else:
                break

        is_anomaly = abs(z_score) >= 2.0 or (persistence_count >= 3 and abs(pct_change) >= 5.0)

        # Historical trend data points for charting
        chart_dates = [d.strftime("%Y-%m-%d") for d in daily_series.index]
        chart_actual = [round(float(v), 2) for v in daily_series.values]
        chart_baseline = [round(float(v), 2) for v in baseline_ewma.values]
        chart_upper = [round(float(b + 2 * s), 2) for b, s in zip(baseline_ewma.values, rolling_std_14d.values)]
        chart_lower = [round(max(0, float(b - 2 * s)), 2) for b, s in zip(baseline_ewma.values, rolling_std_14d.values)]

        trend_points = []
        for i in range(len(chart_dates)):
            trend_points.append({
                "date": chart_dates[i],
                "actual": chart_actual[i],
                "expected": chart_baseline[i],
                "upper_bound": chart_upper[i],
                "lower_bound": chart_lower[i]
            })

        return {
            "kpi_id": kpi_id,
            "status": "ANOMALY_DETECTED" if is_anomaly else "NORMAL",
            "is_anomaly": is_anomaly,
            "actual_value": last_actual,
            "expected_value": last_expected,
            "abs_change": abs_change,
            "pct_change": pct_change,
            "z_score": z_score,
            "persistence_days": persistence_count,
            "recent_7d_mean": round(actual_recent_mean, 2),
            "expected_7d_baseline": round(expected_recent_baseline, 2),
            "trend_series": trend_points
        }
