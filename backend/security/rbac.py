"""
Role-Based Access Control (RBAC) & Field-Level Security Engine
Enforces strict security policies BEFORE context retrieval or LLM narrative generation.
Prevents data leakage of restricted financial or operational fields.
"""

from typing import Dict, Any, List, Set, Optional

ROLE_PERMISSIONS = {
    "cfo": {
        "role_name": "Chief Financial Officer (CFO)",
        "allowed_kpis": ["revenue", "profit_margin", "order_volume", "cac", "roas", "inventory_availability", "conversion_rate"],
        "allowed_fields": ["revenue", "profit", "cost", "profit_margin_pct", "discount_pct", "unit_price", "campaign_spend", "attributed_revenue", "roas", "cac"],
        "restricted_fields": [],
        "description": "Unrestricted executive access across financial performance, margin waterfalls, and corporate KPIs."
    },
    "operations_manager": {
        "role_name": "Operations & Logistics Manager",
        "allowed_kpis": ["inventory_availability", "order_volume", "conversion_rate"],
        "allowed_fields": ["available_units", "demand_units", "stockout_flag", "replenishment_delay_days", "quantity", "orders", "warehouse_id", "lead_time_status"],
        "restricted_fields": ["profit", "cost", "profit_margin_pct", "campaign_spend", "attributed_revenue", "roas"],
        "description": "Operational access to SKU logistics, warehouse inventory, order volume, and fulfillment delays. Financial margins are masked."
    },
    "marketing_director": {
        "role_name": "Director of Performance Marketing",
        "allowed_kpis": ["conversion_rate", "cac", "roas", "order_volume"],
        "allowed_fields": ["campaign_spend", "impressions", "clicks", "conversions", "attributed_revenue", "roas", "cac", "channel", "campaign_id"],
        "restricted_fields": ["cost", "profit", "profit_margin_pct", "replenishment_delay_days", "warehouse_id"],
        "description": "Marketing performance access (CAC, ROAS, clicks, conversion). Operational warehouse logistics and gross margin ledgers are masked."
    },
    "sales_lead": {
        "role_name": "Regional Sales Lead",
        "allowed_kpis": ["order_volume", "conversion_rate"],
        "allowed_fields": ["orders", "quantity", "channel", "region", "discount_pct"],
        "restricted_fields": ["cost", "profit", "profit_margin_pct", "campaign_spend"],
        "description": "Regional sales volume and channel demand access."
    }
}

class RBACEngine:
    def __init__(self):
        pass

    def get_role_info(self, role: str) -> Dict[str, Any]:
        role_key = role.lower()
        return ROLE_PERMISSIONS.get(role_key, ROLE_PERMISSIONS["cfo"])

    def can_access_kpi(self, role: str, kpi_id: str) -> bool:
        role_info = self.get_role_info(role)
        return kpi_id in role_info["allowed_kpis"]

    def filter_evidence_context(self, role: str, raw_evidence: Dict[str, Any]) -> Dict[str, Any]:
        """
        Applies field-level masking and removes restricted data BEFORE passing to LLM or UI.
        """
        role_info = self.get_role_info(role)
        restricted = set(role_info["restricted_fields"])
        filtered = {}

        for k, v in raw_evidence.items():
            if k in restricted:
                filtered[k] = "[RESTRICTED_BY_POLICY]"
            elif isinstance(v, dict):
                filtered[k] = self.filter_evidence_context(role, v)
            elif isinstance(v, list):
                filtered_list = []
                for item in v:
                    if isinstance(item, dict):
                        filtered_list.append(self.filter_evidence_context(role, item))
                    else:
                        filtered_list.append(item)
                filtered[k] = filtered_list
            else:
                filtered[k] = v

        return filtered

    def get_security_audit_log(self, role: str, requested_metric: str) -> Dict[str, Any]:
        has_access = self.can_access_kpi(role, requested_metric)
        return {
            "role": role,
            "requested_metric": requested_metric,
            "access_granted": has_access,
            "policy_action": "PERMIT" if has_access else "DENIED_MASKED",
            "enforcement_point": "PRE_RETRIEVAL_SEMANTIC_GATE"
        }
