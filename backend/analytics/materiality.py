"""
Materiality Engine for BusinessIntelligence.ai
Calculates materiality score based on:
1. Statistical Abnormality (|z-score| / deviation magnitude)
2. Business Financial Impact (INR Crores or absolute KPI impact)
3. Persistence (1-day transient spike vs 7-day sustained trend)
4. Data Quality & Completeness Factor
"""

from typing import Dict, Any

class MaterialityEngine:
    def __init__(self, config: Dict[str, Any] = None):
        self.weights = {
            "statistical": 0.35,
            "business_impact": 0.35,
            "persistence": 0.20,
            "data_quality": 0.10
        }

    def evaluate_materiality(
        self,
        kpi_id: str,
        pct_change: float,
        abs_impact_inr: float,
        z_score: float,
        persistence_days: int,
        data_quality_score: float = 0.95
    ) -> Dict[str, Any]:
        """
        Computes composite materiality index (0.0 to 100.0) and materiality classification.
        """
        # 1. Statistical component (scaled 0 to 100)
        # |z| = 2.0 -> 50, |z| = 3.5 -> 100
        stat_component = min(100.0, (abs(z_score) / 3.5) * 100.0)

        # 2. Business Impact component
        # Normalized based on INR scale or percentage scale
        # For revenue: 3 Cr+ impact reaches 100
        if "revenue" in kpi_id or "profit" in kpi_id:
            impact_cr = abs(abs_impact_inr) / 10000000.0  # 1 Cr = 10,000,000
            biz_component = min(100.0, (impact_cr / 3.0) * 100.0)
        else:
            biz_component = min(100.0, (abs(pct_change) / 15.0) * 100.0)

        # 3. Persistence component
        # 1 day = 25, 3 days = 60, 7+ days = 100
        if persistence_days <= 1:
            persist_component = 25.0
            persist_desc = "Transient single-day fluctuation (Low Persistence)"
        elif persistence_days <= 3:
            persist_component = 65.0
            persist_desc = f"{persistence_days}-day emerging shift (Moderate Persistence)"
        else:
            persist_component = 100.0
            persist_desc = f"{persistence_days}-day sustained structural deviation (High Persistence)"

        # 4. Data Quality factor (0.0 to 100.0)
        quality_component = max(0.0, min(100.0, data_quality_score * 100.0))

        # Composite Materiality Score
        composite_score = (
            stat_component * self.weights["statistical"] +
            biz_component * self.weights["business_impact"] +
            persist_component * self.weights["persistence"] +
            quality_component * self.weights["data_quality"]
        )

        composite_score = round(composite_score, 1)

        # Classification Level
        if composite_score >= 70.0:
            level = "HIGH_MATERIALITY"
            urgency = "URGENT_EXECUTIVE_TRIAGE"
            badge = "HIGH RISK"
        elif composite_score >= 45.0:
            level = "MEDIUM_MATERIALITY"
            urgency = "OPERATIONAL_INVESTIGATION"
            badge = "MEDIUM"
        else:
            level = "LOW_MATERIALITY"
            urgency = "INFORMATIONAL_MONITORING"
            badge = "LOW"

        return {
            "kpi_id": kpi_id,
            "materiality_score": composite_score,
            "materiality_level": level,
            "badge": badge,
            "urgency": urgency,
            "persistence_description": persist_desc,
            "components": {
                "statistical_significance": {
                    "score": round(stat_component, 1),
                    "z_score": z_score,
                    "weight": self.weights["statistical"]
                },
                "business_financial_impact": {
                    "score": round(biz_component, 1),
                    "impact_inr": abs_impact_inr,
                    "weight": self.weights["business_impact"]
                },
                "persistence": {
                    "score": round(persist_component, 1),
                    "days": persistence_days,
                    "weight": self.weights["persistence"]
                },
                "data_quality": {
                    "score": round(quality_component, 1),
                    "quality_index": data_quality_score,
                    "weight": self.weights["data_quality"]
                }
            },
            "formula_audit": "0.35 * Statistical + 0.35 * BizImpact + 0.20 * Persistence + 0.10 * DataQuality"
        }
