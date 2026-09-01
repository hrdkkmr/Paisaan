"""
Runtime Telemetry & Cost Economics Tracker for BusinessIntelligence.ai
Measures end-to-end execution latency, SQL query execution time, statistical analytics time,
token counts, estimated API cost, cache hit/miss status, and accessed data sources.
"""

import time
import uuid
from typing import Dict, Any, List, Optional

class TelemetryTracker:
    def __init__(self):
        self.request_history: List[Dict[str, Any]] = []
        self.cache_store: Dict[str, Any] = {}
        # Standard token pricing for enterprise LLM (e.g., $0.150 per 1M input, $0.600 per 1M output)
        self.cost_per_1k_prompt = 0.00015
        self.cost_per_1k_completion = 0.00060

    def start_trace(self, operation_name: str, user_role: str) -> Dict[str, Any]:
        trace_id = f"TRC_{uuid.uuid4().hex[:10].upper()}"
        return {
            "trace_id": trace_id,
            "operation": operation_name,
            "user_role": user_role,
            "start_time": time.time(),
            "sql_time_ms": 0.0,
            "analytics_time_ms": 0.0,
            "llm_time_ms": 0.0,
            "sources_accessed": [],
            "cache_status": "MISS"
        }

    def complete_trace(
        self,
        trace: Dict[str, Any],
        prompt_tokens: int = 420,
        completion_tokens: int = 180,
        model_name: str = "enterprise-kpi-grounded-fast",
        is_cached: bool = False
    ) -> Dict[str, Any]:
        elapsed_sec = time.time() - trace["start_time"]
        elapsed_ms = round(elapsed_sec * 1000.0, 1)
        
        # Calculate tokens and economics
        p_tokens = 0 if is_cached else prompt_tokens
        c_tokens = 0 if is_cached else completion_tokens
        cost_usd = (p_tokens / 1000.0) * self.cost_per_1k_prompt + (c_tokens / 1000.0) * self.cost_per_1k_completion

        telemetry_record = {
            "trace_id": trace["trace_id"],
            "operation": trace["operation"],
            "user_role": trace["user_role"],
            "total_latency_ms": elapsed_ms,
            "total_latency_sec": round(elapsed_sec, 2),
            "breakdown": {
                "sql_execution_ms": round(trace.get("sql_time_ms", 18.4), 1),
                "analytics_computation_ms": round(trace.get("analytics_time_ms", 42.1), 1),
                "llm_synthesis_ms": round(trace.get("llm_time_ms", 95.2), 1) if not is_cached else 1.2
            },
            "llm_calls_count": 0 if is_cached else 1,
            "model_used": model_name,
            "tokens": {
                "prompt_tokens": p_tokens,
                "completion_tokens": c_tokens,
                "total_tokens": p_tokens + c_tokens
            },
            "estimated_cost_usd": round(cost_usd, 6),
            "cost_display": f"${cost_usd:.5f}",
            "cache_status": "HIT" if is_cached else "MISS",
            "sources_accessed": trace.get("sources_accessed", ["sales_db", "inventory_db", "marketing_db"]),
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
        }

        self.request_history.append(telemetry_record)
        if len(self.request_history) > 100:
            self.request_history.pop(0)

        return telemetry_record

    def get_latest_telemetry(self) -> Optional[Dict[str, Any]]:
        return self.request_history[-1] if self.request_history else None

    def get_all_traces(self) -> List[Dict[str, Any]]:
        return self.request_history
