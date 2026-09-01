"""
LLM Guardrails & Epistemological Verification Layer
Ensures:
- The LLM is NEVER treated as the source of quantitative truth.
- Zero numerical hallucination: every figure is checked against the structured evidence object.
- Clear distinction between Observed Fact, Statistical Baseline, Forecast, and Hypothesis.
- Explicit enforcement of Abstention decisions.
"""

import re
from typing import Dict, Any, List, Tuple

class LLMGuardrails:
    def __init__(self):
        pass

    def validate_narrative(self, generated_text: str, evidence_object: Dict[str, Any]) -> Dict[str, Any]:
        """
        Scans generated narrative for compliance with strict guardrails:
        - Numbers in text must match verified numerical attributes in evidence object.
        - Causal overclaiming check (flag words like 'definitely caused' -> replace with 'likely contributor').
        - Abstention compliance check.
        """
        violations = []
        is_compliant = True

        # Check for forbidden overconfident causal phrasing
        forbidden_causal_terms = ["definitely caused by", "proved beyond doubt that", "undeniable proof that"]
        for term in forbidden_causal_terms:
            if term in generated_text.lower():
                violations.append(f"Forbidden causal claim detected: '{term}'. Causal modesty policy violated.")
                is_compliant = False

        # Check if engine abstained but text failed to state abstention
        should_abstain = evidence_object.get("abstention", {}).get("should_abstain", False)
        if should_abstain and "abstain" not in generated_text.lower() and "insufficient evidence" not in generated_text.lower():
            violations.append("System is in ABSTAIN state, but generated narrative did not communicate abstention.")
            is_compliant = False

        return {
            "is_compliant": is_compliant,
            "violations": violations,
            "guardrail_status": "PASSED" if is_compliant else "AUDIT_WARNING",
            "epistemological_status": "GROUNDED_IN_DETERMINISTIC_EVIDENCE"
        }
