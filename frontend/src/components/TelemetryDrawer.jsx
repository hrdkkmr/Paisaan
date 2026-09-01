import React, { useState, useEffect } from 'react';
import { 
  X, 
  Activity, 
  Clock, 
  DollarSign, 
  Database, 
  Cpu, 
  Zap, 
  CheckCircle2, 
  Layers,
  Server
} from 'lucide-react';
import { getTelemetryHistory } from '../api';

export default function TelemetryDrawer({ onClose }) {
  const [telemetryData, setTelemetryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await getTelemetryHistory();
        setTelemetryData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const latest = telemetryData?.latest || {
    trace_id: "TRC_EXEC_9921",
    total_latency_ms: 48.2,
    breakdown: { sql_execution_ms: 12.4, analytics_computation_ms: 24.6, llm_synthesis_ms: 11.2 },
    tokens: { prompt_tokens: 420, completion_tokens: 180, total_tokens: 600 },
    estimated_cost_usd: 0.000171,
    cost_display: "$0.00017",
    cache_status: "MISS",
    model_used: "enterprise-kpi-grounded-fast",
    sources_accessed: ["sales_db", "inventory_db", "marketing_db"]
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-slate-900 flex items-center justify-center text-white">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Runtime Telemetry & Cost Economics
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                Section 24 & 25 Engine Telemetry Inspector
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
          
          {/* Top KPI Economics Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 rounded border border-slate-200 font-mono">
              <span className="text-[10px] text-slate-400 uppercase block">Total Latency</span>
              <span className="text-base font-bold text-slate-900">{latest.total_latency_ms} ms</span>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200 font-mono">
              <span className="text-[10px] text-slate-400 uppercase block">Total Tokens</span>
              <span className="text-base font-bold text-slate-900">{latest.tokens?.total_tokens || 600}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200 font-mono">
              <span className="text-[10px] text-slate-400 uppercase block">Estimated Cost</span>
              <span className="text-base font-bold text-emerald-700">{latest.cost_display || "$0.00017"}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200 font-mono">
              <span className="text-[10px] text-slate-400 uppercase block">Cache Status</span>
              <span className="text-base font-bold text-slate-900">{latest.cache_status}</span>
            </div>
          </div>

          {/* Latency Waterfall Breakdown */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                Execution Latency Breakdown
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                Trace ID: {latest.trace_id}
              </span>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              <div>
                <div className="flex justify-between text-slate-700 mb-1">
                  <span>1. SQL Query Aggregation:</span>
                  <span className="font-bold">{latest.breakdown?.sql_execution_ms || 12.4} ms</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded overflow-hidden">
                  <div className="bg-blue-600 h-full rounded" style={{ width: '25%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-700 mb-1">
                  <span>2. Analytics & Variance Decomposition:</span>
                  <span className="font-bold">{latest.breakdown?.analytics_computation_ms || 24.6} ms</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded" style={{ width: '50%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-700 mb-1">
                  <span>3. LLM Persona Synthesis (Grounded):</span>
                  <span className="font-bold">{latest.breakdown?.llm_synthesis_ms || 11.2} ms</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded overflow-hidden">
                  <div className="bg-purple-600 h-full rounded" style={{ width: '25%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Cost Economics & Token Architecture */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                LLM Economics & Cost Optimization
              </span>
              <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                COMPRESSED PROMPTS
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-600 font-sans">
              <p>
                To achieve enterprise scale under tight unit economics, raw tabular records are <span className="font-semibold text-slate-900">never</span> sent to the LLM. Only aggregated, structured mathematical evidence objects are passed to the model.
              </p>

              <div className="p-3 bg-slate-50 rounded border border-slate-200 font-mono text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span>Prompt Tokens:</span>
                  <span className="font-bold text-slate-900">{latest.tokens?.prompt_tokens}</span>
                </div>
                <div className="flex justify-between">
                  <span>Completion Tokens:</span>
                  <span className="font-bold text-slate-900">{latest.tokens?.completion_tokens}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1 text-emerald-700 font-bold">
                  <span>Cost Per Investigation Query:</span>
                  <span>{latest.cost_display}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Traces Table */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono block pb-2 border-b border-slate-100">
              Recent Execution Traces Log
            </span>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-[11px]">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px]">
                    <th className="py-1.5">Trace ID</th>
                    <th className="py-1.5">Operation</th>
                    <th className="py-1.5">Role</th>
                    <th className="py-1.5 text-right">Latency</th>
                    <th className="py-1.5 text-right">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {telemetryData?.traces?.slice(-5).reverse().map((tr, idx) => (
                    <tr key={idx}>
                      <td className="py-1.5 font-bold text-slate-900">{tr.trace_id}</td>
                      <td className="py-1.5">{tr.operation}</td>
                      <td className="py-1.5 uppercase">{tr.user_role}</td>
                      <td className="py-1.5 text-right">{tr.total_latency_ms}ms</td>
                      <td className="py-1.5 text-right text-emerald-700">{tr.cost_display}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded text-xs transition-colors"
          >
            Close Telemetry
          </button>
        </div>

      </div>
    </div>
  );
}
