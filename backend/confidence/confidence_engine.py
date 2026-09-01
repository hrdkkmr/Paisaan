"""
Evidence & Confidence Engine for BusinessIntelligence.ai
Calculates evidence-grounded confidence scores across data completeness,
reliability, freshness, statistical power, and cross-source consensus.
"""

from typing import Dict, Any, List

class ConfidenceEngine:
    def __init__(self):
        pass

    def evaluate_confidence(
        self,
        kpi_id: str,
        sources_used: List[str],
        source_metadata: Dict[str, Any],
        has_contradictions: bool = False,
        contradiction_severity: float = 0.0,
        is_sparse_history: bool = False,
        history_days: int = 120
    ) -> Dict[str, Any]:
        """
        Derives analytical confidence numerically and categorically.
        """
        # 1. Base Data Completeness (0 to 100)
        completeness = 95.0
        if is_sparse_history:
            completeness = max(20.0, min(50.0, (history_days / 60.0) * 100.0))

        # 2. Source Reliability Factor
        reliability_scores = []
        freshness_scores = []
        for s in sources_used:
            s_info = source_metadata.get("sources", {}).get(s, {})
            rel = s_info.get("reliability_score", 0.85) * 100.0
            lag = s_info.get("freshness_lag_hours", 2.0)
            fresh = max(20.0, 100.0 - (lag * 2.5))
            reliability_scores.append(rel)
            freshness_scores.append(fresh)

        avg_reliability = sum(reliability_scores) / len(reliability_scores) if reliability_scores else 85.0
        avg_freshness = sum(freshness_scores) / len(freshness_scores) if freshness_scores else 90.0

        # 3. Statistical Significance Factor
        stat_power = 92.0 if not is_sparse_history else 35.0

        # 4. Cross-Source Consensus
        cross_source_agreement = 90.0
        if has_contradictions:
            cross_source_agreement = max(20.0, 90.0 - (contradiction_severity * 60.0))

        # Weighted calculation
        raw_score = (
            completeness * 0.25 +
            avg_reliability * 0.25 +
            avg_freshness * 0.15 +
            stat_power * 0.20 +
            cross_source_agreement * 0.15
        )

        # Penalties
        if has_contradictions:
            raw_score -= (contradiction_severity * 45.0)
            raw_score = min(raw_score, 38.0) # Cap at low confidence under active conflict
        if is_sparse_history:
            raw_score = min(raw_score, 31.0) # Hard cap for sparse history per specification

        final_score = round(max(5.0, min(99.0, raw_score)), 1)

        # Classification
        if final_score >= 75.0:
            level = "HIGH"
            level_desc = "Strong multi-source corroboration and high freshness."
        elif final_score >= 50.0:
            level = "MEDIUM"
            level_desc = "Moderate evidence confidence with minor data lag or partial coverage."
        else:
            level = "LOW"
            level_desc = "Insufficient or conflicting evidence. Analytical abstention recommended."

        return {
            "score": final_score,
            "level": level,
            "level_description": level_desc,
            "components": {
                "data_completeness": round(completeness, 1),
                "source_reliability": round(avg_reliability, 1),
                "data_freshness": round(avg_freshness, 1),
                "statistical_power": round(stat_power, 1),
                "cross_source_agreement": round(cross_source_agreement, 1),
                "contradiction_penalty": round(contradiction_severity * 30.0, 1) if has_contradictions else 0.0
            },
            "formula": "0.25*Completeness + 0.25*Reliability + 0.15*Freshness + 0.20*StatPower + 0.15*Agreement - Penalties"
        }
