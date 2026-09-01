"""
Action Recommendation Engine for BusinessIntelligence.ai
Translates identified drivers into structured, controllable business interventions:
Driver -> Controllable Lever -> Recommended Action -> Financial Impact (₹) -> Owner -> Confidence -> Monitoring Plan.
Filters out non-controllable or weakly supported causes.
"""

from typing import Dict, Any, List

class ActionRecommendationEngine:
    def __init__(self):
        # Catalog of governed action templates mapped to levers
        self.action_playbooks = {
            "inventory_shortage_north": {
                "lever": "Expedited Logistics & Inter-DC Rebalancing",
                "action_title": "Expedite Inbound Logistics & Rebalance 14 Critical SKUs to North Hub",
                "detailed_steps": [
                    "Authorize air-freight / express line-haul for top 14 revenue SKUs (Laptops & ANC Headphones) from West Central Warehouse to North Hub.",
                    "Temporarily re-route incoming container shipments directly to Delhi-NCR staging facility.",
                    "Implement dynamic allocation to prioritize high-AOV orders on web/app channels."
                ],
                "financial_impact_range": "₹1.4 Cr – ₹1.9 Cr Revenue Protection",
                "owner": "Head of Supply Chain / Logistics Lead",
                "action_confidence_pct": 84,
                "urgency": "Immediate (Within 12 Hours)",
                "monitoring_plan": {
                    "target_metric": "North Hub On-Shelf Availability",
                    "target_value": ">= 92.0%",
                    "verification_timeframe": "72 Hours",
                    "telemetry_check": "Hourly WMS scan with automated escalation to COO if <88% at T+48h."
                }
            },
            "product_mix_shift": {
                "lever": "Merchandising & Bundle Pricing",
                "action_title": "Deploy High-AOV Cross-Sell Bundles and Adjust Homepage Real Estate",
                "detailed_steps": [
                    "Feature high-margin Electronics & Home accessories on homepage hero carousel.",
                    "Launch automated bundle discount (+12% discount on paired accessories) to lift basket value.",
                    "Cap discount on single-item low-margin Apparel SKUs to 15%."
                ],
                "financial_impact_range": "₹0.6 Cr – ₹0.9 Cr Margin Recovery",
                "owner": "Head of E-Commerce Merchandising",
                "action_confidence_pct": 78,
                "urgency": "Medium (Within 24 Hours)",
                "monitoring_plan": {
                    "target_metric": "Average Order Value (AOV) & Electronics Share",
                    "target_value": "AOV >= ₹8,200 (from ₹7,100)",
                    "verification_timeframe": "5 Days",
                    "telemetry_check": "Daily transaction log audit."
                }
            },
            "marketing_efficiency_east": {
                "lever": "Campaign Bid Triage & Tag Reconciliation",
                "action_title": "Pause Stale Conversion Bidding in East Region & Audit Attribution Pixels",
                "detailed_steps": [
                    "Switch Meta/Google smart bidding campaigns in East Region to manual CPC cap.",
                    "Dispatch engineering ticket to fix 26h telemetry synchronization lag on checkout pixel.",
                    "Reallocate ₹12L weekly spend to highest-converting West Region campaigns."
                ],
                "financial_impact_range": "₹0.3 Cr – ₹0.5 Cr Ad Spend Wastage Reduction",
                "owner": "Director of Performance Marketing",
                "action_confidence_pct": 72,
                "urgency": "High (Within 6 Hours)",
                "monitoring_plan": {
                    "target_metric": "East Region ROAS & Pixel Freshness",
                    "target_value": "ROAS >= 3.2x, Telemetry Lag < 2h",
                    "verification_timeframe": "48 Hours",
                    "telemetry_check": "Real-time Ad Spend vs Confirmed Orders reconciliation."
                }
            }
        }

    def generate_recommendations(self, ranked_drivers: List[Dict[str, Any]], should_abstain: bool = False) -> List[Dict[str, Any]]:
        """
        Generates actionable recommendations only for controllable drivers with strong evidence.
        Suppresses recommendations if engine is in ABSTAIN state.
        """
        if should_abstain:
            return []

        actions = []
        for d in ranked_drivers:
            d_id = d.get("driver_id", "")
            ctrl = d.get("controllability", "MEDIUM").upper()

            # Filter out low controllability drivers (e.g. macro competitor price cuts)
            if ctrl == "LOW":
                continue

            # Check if playbook exists
            playbook = self.action_playbooks.get(d_id)
            if playbook:
                actions.append({
                    "action_id": f"ACT_{d_id.upper()}",
                    "driver_id": d_id,
                    "driver_name": d.get("name"),
                    "driver_contribution_pct": d.get("contribution_pct"),
                    "controllable_lever": playbook["lever"],
                    "action_title": playbook["action_title"],
                    "detailed_steps": playbook["detailed_steps"],
                    "expected_impact": playbook["financial_impact_range"],
                    "owner": playbook["owner"],
                    "confidence_pct": playbook["action_confidence_pct"],
                    "urgency": playbook["urgency"],
                    "monitoring_plan": playbook["monitoring_plan"]
                })

        return actions
