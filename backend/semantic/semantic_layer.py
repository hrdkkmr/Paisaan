"""
KPI Semantic Layer for BusinessIntelligence.ai
Provides governed KPI definitions, access-control policies, metric formulas,
lineage tracking, and baseline calculation logic.
"""

import json
import os
from typing import Dict, Any, List, Optional

class SemanticLayer:
    def __init__(self, registry_path: Optional[str] = None):
        if registry_path is None:
            registry_path = os.path.join(os.path.dirname(__file__), "registry.json")
        with open(registry_path, "r") as f:
            self.registry = json.load(f)
        self.kpis: Dict[str, Any] = self.registry.get("kpis", {})

    def get_kpi(self, kpi_id: str) -> Optional[Dict[str, Any]]:
        return self.kpis.get(kpi_id)

    def list_kpis(self) -> List[Dict[str, Any]]:
        return list(self.kpis.values())

    def get_accessible_kpis(self, role: str) -> List[Dict[str, Any]]:
        """
        Returns KPIs accessible to the specified user role.
        Admin or Executive can see all.
        """
        role_normalized = role.lower()
        accessible = []
        for kpi_id, defn in self.kpis.items():
            policies = [p.lower() for p in defn.get("access_policy", [])]
            if "admin" in policies or "executive" in policies or role_normalized in policies:
                accessible.append(defn)
        return accessible

    def check_access(self, kpi_id: str, role: str) -> bool:
        kpi = self.get_kpi(kpi_id)
        if not kpi:
            return False
        policies = [p.lower() for p in kpi.get("access_policy", [])]
        return role.lower() in policies or "admin" in policies or "executive" in policies

    def get_kpi_lineage(self, kpi_id: str) -> Dict[str, Any]:
        kpi = self.get_kpi(kpi_id)
        if not kpi:
            return {}
        return {
            "kpi_id": kpi_id,
            "name": kpi.get("name"),
            "formula": kpi.get("formula"),
            "lineage_columns": kpi.get("lineage", []),
            "sources": kpi.get("sources", []),
            "refresh_cadence": kpi.get("refresh_cadence"),
            "business_rules": kpi.get("business_rules", [])
        }

    def get_materiality_config(self, kpi_id: str) -> Dict[str, Any]:
        kpi = self.get_kpi(kpi_id)
        if not kpi:
            return {"relative_change_pct": 5.0, "z_score_threshold": 2.0, "persistence_days_min": 2}
        return kpi.get("materiality", {})
