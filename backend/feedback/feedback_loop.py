"""
Feedback Loop & Weight Calibration Engine for BusinessIntelligence.ai
Captures analyst corrections and adapts driver ranking weights over time.
Demonstrates live: Before feedback vs After feedback ranking comparison.
"""

import datetime
from typing import Dict, Any, List

class FeedbackLoopEngine:
    def __init__(self):
        self.feedback_store: List[Dict[str, Any]] = []
        # Dynamic calibrated weights
        self.calibrated_weights = {
            "contribution": 0.35,
            "evidence_quality": 0.20,
            "statistical_strength": 0.15,
            "controllability": 0.15,
            "freshness": 0.15
        }
        self.driver_bias_adjustments: Dict[str, float] = {}

    def record_feedback(
        self,
        insight_id: str,
        user_role: str,
        feedback_type: str,  # 'CORRECT_DRIVER', 'INCORRECT_DRIVER', 'MISSING_DRIVER', 'HELPFUL', 'NOT_HELPFUL'
        target_driver_id: str,
        corrected_driver_id: str = None,
        analyst_notes: str = ""
    ) -> Dict[str, Any]:
        """
        Records feedback and executes Bayesian-style weight calibration.
        """
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        entry = {
            "feedback_id": f"FB_{len(self.feedback_store) + 1:04d}",
            "insight_id": insight_id,
            "user_role": user_role,
            "feedback_type": feedback_type,
            "target_driver_id": target_driver_id,
            "corrected_driver_id": corrected_driver_id,
            "notes": analyst_notes,
            "timestamp": timestamp
        }
        self.feedback_store.append(entry)

        # Apply weight calibration update
        if feedback_type == "CORRECT_DRIVER":
            # Boost confidence & weight for this driver pattern
            current_bias = self.driver_bias_adjustments.get(target_driver_id, 0.0)
            self.driver_bias_adjustments[target_driver_id] = round(current_bias + 0.08, 3)
            self.calibrated_weights["evidence_quality"] = min(0.35, round(self.calibrated_weights["evidence_quality"] + 0.02, 3))
            self.calibrated_weights["contribution"] = max(0.25, round(self.calibrated_weights["contribution"] - 0.02, 3))
            
        elif feedback_type == "INCORRECT_DRIVER":
            # Penalize driver pattern
            current_bias = self.driver_bias_adjustments.get(target_driver_id, 0.0)
            self.driver_bias_adjustments[target_driver_id] = round(current_bias - 0.12, 3)
            self.calibrated_weights["freshness"] = min(0.30, round(self.calibrated_weights["freshness"] + 0.03, 3))

        return {
            "status": "FEEDBACK_REGISTERED",
            "entry": entry,
            "updated_weights": self.calibrated_weights,
            "driver_biases": self.driver_bias_adjustments,
            "total_feedbacks_count": len(self.feedback_store)
        }

    def get_calibrated_weights(self) -> Dict[str, float]:
        return self.calibrated_weights

    def get_feedback_history(self) -> List[Dict[str, Any]]:
        return self.feedback_store
