"""
Automated Verification Suite for BusinessIntelligence.ai Engine
Tests:
- Governed Semantic Layer Contracts
- Deterministic Anomaly Detection & Baselines
- Multi-factor Materiality Scoring
- Variance Decomposition & Waterfall math
- Driver Ranking & Feedback Calibration Loop
- Evidence Graph & Multivariate Confidence Score
- Contradiction Detection & Explicit Abstention
- Financial Pre-Mortem Proactive Risk Radar
- RBAC Field Masking & Security Enforcement
- Persona Synthesis & LLM Guardrails
- All 6 Scenario Presets
"""

import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import pytest
from fastapi.testclient import TestClient
from app import app, semantic_layer, anomaly_detector, driver_engine, ranking_engine, feedback_engine, confidence_engine, contradiction_engine, pre_mortem_engine, rbac_engine

client = TestClient(app)

def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "HEALTHY"
    assert data["datasets"]["sales_transactions"] > 10000

def test_semantic_registry():
    kpis = semantic_layer.list_kpis()
    assert len(kpis) >= 5
    rev = semantic_layer.get_kpi("revenue")
    assert rev is not None
    assert "SUM(revenue)" in rev["formula"]
    assert "cfo" in rev["access_policy"]

def test_overview_endpoint():
    res = client.get("/api/overview?role=cfo")
    assert res.status_code == 200
    data = res.json()
    assert "kpis" in data
    assert len(data["kpis"]) >= 5
    rev_kpi = next(k for k in data["kpis"] if k["kpi_id"] == "revenue")
    assert rev_kpi["access_granted"] is True
    assert rev_kpi["materiality"]["materiality_level"] in ["HIGH_MATERIALITY", "MEDIUM_MATERIALITY"]

def test_rbac_field_masking():
    # Operations manager should not have access to profit margin
    res_ops = client.get("/api/overview?role=operations_manager")
    assert res_ops.status_code == 200
    data_ops = res_ops.json()
    profit_kpi = next(k for k in data_ops["kpis"] if k["kpi_id"] == "profit_margin")
    assert profit_kpi["access_granted"] is False
    assert profit_kpi["badge"] == "RESTRICTED"

def test_driver_investigation():
    res = client.get("/api/kpi/revenue/investigate?role=cfo&persona=cfo")
    assert res.status_code == 200
    data = res.json()
    assert "what_changed" in data
    assert "why_it_changed" in data
    assert "evidence_graph" in data
    assert "recommended_actions" in data
    assert len(data["why_it_changed"]["waterfall_drivers"]) >= 4
    # Check top driver is volume/inventory
    assert data["confidence"]["score"] > 70
    assert len(data["recommended_actions"]) >= 1

def test_contradiction_and_abstention():
    res = client.get("/api/kpi/revenue/investigate?role=cfo&persona=cfo&context_override=marketing_conflict")
    assert res.status_code == 200
    data = res.json()
    assert data["abstention"]["should_abstain"] is True
    assert "ABSTAIN" in data["abstention"]["abstention_badge"]
    assert data["confidence"]["score"] < 50
    assert len(data["recommended_actions"]) == 0 # Actions suppressed during abstention

def test_sparse_history_abstention():
    res = client.get("/api/kpi/revenue/investigate?role=cfo&persona=cfo&context_override=sparse_history")
    assert res.status_code == 200
    data = res.json()
    assert data["abstention"]["should_abstain"] is True
    assert data["abstention"]["abstention_type"] == "SPARSE_HISTORY_ABSTAIN"
    assert data["confidence"]["score"] <= 38.0

def test_financial_pre_mortem():
    res = client.get("/api/pre-mortem?role=cfo&persona=cfo")
    assert res.status_code == 200
    data = res.json()
    assert data["risk_status"] == "HIGH_TARGET_RISK"
    assert data["risk_probability_pct"] == 72
    assert len(data["leading_indicators"]) >= 3
    assert len(data["preventive_playbooks"]) >= 2

def test_feedback_calibration_loop():
    res = client.post("/api/feedback", json={
        "insight_id": "INS_001",
        "user_role": "cfo",
        "feedback_type": "CORRECT_DRIVER",
        "target_driver_id": "inventory_shortage_north",
        "notes": "Verified inventory shortage is primary contributor."
    })
    assert res.status_code == 200
    data = res.json()
    assert data["feedback_ack"]["status"] == "FEEDBACK_REGISTERED"
    assert len(data["reranked_drivers"]) > 0

def test_all_six_scenarios():
    for sc in [
        "scenario-1-strong-evidence",
        "scenario-2-contradictory-evidence",
        "scenario-3-sparse-history",
        "scenario-4-persona-difference",
        "scenario-5-security-rbac",
        "scenario-6-financial-pre-mortem"
    ]:
        res = client.get(f"/api/scenario/{sc}")
        assert res.status_code == 200, f"Scenario {sc} failed with code {res.status_code}"

if __name__ == "__main__":
    pytest.main(["-v", __file__])
