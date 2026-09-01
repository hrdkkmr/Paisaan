"""
Data Reconciliation Layer for BusinessIntelligence.ai
Reconciles heterogeneous grains, cadences, coverage, and freshness across
Sales, Marketing, Inventory, and External macro datasets.
"""

import datetime
import pandas as pd
from typing import Dict, Any, List

class DataReconciler:
    def __init__(self, raw_data: Dict[str, pd.DataFrame]):
        self.raw_data = raw_data
        self.metadata = self._compute_source_metadata()
        self.reconciled_daily = self._build_reconciled_daily_cube()

    def _compute_source_metadata(self) -> Dict[str, Any]:
        sales_df = self.raw_data["sales"]
        mkt_df = self.raw_data["marketing"]
        inv_df = self.raw_data["inventory"]
        ext_df = self.raw_data["external"]

        min_sales_dt = sales_df["date"].min()
        max_sales_dt = sales_df["date"].max()
        
        # Check SmartPhone X coverage specifically
        sp_df = sales_df[sales_df["product_id"] == "PROD_SMARTPHONE_X"]
        sp_days = sp_df["date"].nunique() if not sp_df.empty else 0

        now_simulated = datetime.datetime(2026, 8, 31, 10, 30, 0)

        return {
            "sources": {
                "sales_db": {
                    "source_name": "Sales Transaction Ledger",
                    "grain": "transaction-level (hourly events)",
                    "refresh_cadence": "hourly",
                    "last_refresh": "2026-08-31 10:00:00 (30m ago)",
                    "freshness_status": "CURRENT",
                    "freshness_lag_hours": 0.5,
                    "coverage_start": min_sales_dt,
                    "coverage_end": max_sales_dt,
                    "total_records": len(sales_df),
                    "missingness_pct": 0.0,
                    "reliability_score": 0.98
                },
                "inventory_db": {
                    "source_name": "WMS / Inventory Snapshots",
                    "grain": "SKU / Region / 6-Hour Snapshot",
                    "refresh_cadence": "6-hourly",
                    "last_refresh": "2026-08-31 06:00:00 (4.5h ago)",
                    "freshness_status": "CURRENT",
                    "freshness_lag_hours": 4.5,
                    "coverage_start": inv_df["date"].min(),
                    "coverage_end": inv_df["date"].max(),
                    "total_records": len(inv_df),
                    "missingness_pct": 0.2,
                    "reliability_score": 0.94
                },
                "marketing_db": {
                    "source_name": "Ad Platforms & Pixel Attribution",
                    "grain": "Campaign / Region / Day",
                    "refresh_cadence": "daily",
                    "last_refresh": "2026-08-30 08:00:00 (26.5h ago - Attribution Lag)",
                    "freshness_status": "DELAYED_ATTRIBUTION",
                    "freshness_lag_hours": 26.5,
                    "coverage_start": mkt_df["date"].min(),
                    "coverage_end": mkt_df["date"].max(),
                    "total_records": len(mkt_df),
                    "missingness_pct": 3.8,
                    "reliability_score": 0.76
                },
                "external_db": {
                    "source_name": "Macro & Competitor Price Intelligence",
                    "grain": "Region / Day",
                    "refresh_cadence": "daily",
                    "last_refresh": "2026-08-30 23:50:00 (10.5h ago)",
                    "freshness_status": "CURRENT",
                    "freshness_lag_hours": 10.5,
                    "coverage_start": ext_df["date"].min(),
                    "coverage_end": ext_df["date"].max(),
                    "total_records": len(ext_df),
                    "missingness_pct": 1.1,
                    "reliability_score": 0.88
                }
            },
            "special_entities": {
                "PROD_SMARTPHONE_X": {
                    "entity_type": "New Product Launch",
                    "active_history_days": sp_days,
                    "is_sparse_history": True,
                    "min_forecast_days_required": 60,
                    "status": "SPARSE_HISTORY_ACTIVE",
                    "benchmark_substitute": "Electronics:Category_Mean"
                }
            }
        }

    def _build_reconciled_daily_cube(self) -> pd.DataFrame:
        """
        Reconciles sales, marketing, inventory, and external signals into a unified
        multi-dimensional analytical cube at Date x Region x Category grain.
        """
        sales_df = self.raw_data["sales"]
        mkt_df = self.raw_data["marketing"]
        inv_df = self.raw_data["inventory"]
        ext_df = self.raw_data["external"]

        # Aggregate Sales by date, region, category
        sales_agg = sales_df.groupby(["date", "region", "category"]).agg(
            revenue=("revenue", "sum"),
            cost=("cost", "sum"),
            profit=("profit", "sum"),
            volume=("quantity", "sum"),
            orders=("order_id", "nunique"),
            avg_discount=("discount_pct", "mean")
        ).reset_index()

        # Aggregate Inventory by date, region, category (average across 6h snapshots)
        inv_agg = inv_df.groupby(["date", "region", "category"]).agg(
            available_units=("available_units", "sum"),
            demand_units=("demand_units", "sum"),
            stockout_count=("stockout_flag", "sum"),
            avg_delay_days=("replenishment_delay_days", "mean")
        ).reset_index()
        inv_agg["availability_pct"] = (inv_agg["available_units"] / inv_agg["demand_units"].replace(0, 1)) * 100

        # Aggregate Marketing by date, region
        mkt_agg = mkt_df.groupby(["date", "region"]).agg(
            campaign_spend=("campaign_spend", "sum"),
            impressions=("impressions", "sum"),
            clicks=("clicks", "sum"),
            conversions=("conversions", "sum"),
            attributed_revenue=("attributed_revenue", "sum")
        ).reset_index()

        # External signals by date, region
        ext_agg = ext_df.groupby(["date", "region"]).agg(
            competitor_price_index=("competitor_price_index", "mean"),
            market_demand_index=("market_demand_index", "mean"),
            holiday_flag=("holiday_flag", "max")
        ).reset_index()

        # Merge cubes
        merged = pd.merge(sales_agg, inv_agg, on=["date", "region", "category"], how="left")
        merged = pd.merge(merged, mkt_agg, on=["date", "region"], how="left")
        merged = pd.merge(merged, ext_agg, on=["date", "region"], how="left")

        # Computed fields
        merged["profit_margin_pct"] = (merged["profit"] / merged["revenue"].replace(0, 1)) * 100
        merged["conversion_rate_pct"] = (merged["orders"] / merged["clicks"].replace(0, 1)) * 100
        merged["roas"] = merged["attributed_revenue"] / merged["campaign_spend"].replace(0, 1)

        return merged

    def get_reconciled_cube(self) -> pd.DataFrame:
        return self.reconciled_daily

    def get_source_metadata(self) -> Dict[str, Any]:
        return self.metadata
