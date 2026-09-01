import React from 'react';
import { 
  X, 
  HelpCircle, 
  Database, 
  FileCode2, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  GitBranch, 
  ShieldCheck,
  Cpu
} from 'lucide-react';

export default function EvidenceGraphDrawer({ evidence, onClose }) {
  if (!evidence) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-slate-900 flex items-center justify-center text-white">
              <GitBranch className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Traceable Evidence Graph
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                Lineage & Provenance for {evidence.kpi_name}
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
          
          {/* Question Callout */}
          <div className="p-3 bg-slate-100 rounded-lg border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Core Epistemological Question:
            </span>
            <p className="text-sm font-semibold text-slate-900 mt-1">
              "Why do you believe Gross Revenue fell by 11.8% due to North Hub stockouts?"
            </p>
          </div>

          {/* KPI Computation Contract */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold uppercase tracking-wider text-[11px]">
              <FileCode2 className="w-4 h-4 text-slate-700" />
              <span>Governed KPI Semantic Contract</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded border border-slate-200 font-mono text-xs space-y-1.5">
              <div>
                <span className="text-slate-500">Formula: </span>
                <span className="text-slate-900 font-bold">{evidence.formula || "SUM(revenue)"}</span>
              </div>
              <div>
                <span className="text-slate-500">Grain: </span>
                <span className="text-slate-800">Daily transaction aggregation</span>
              </div>
              <div>
                <span className="text-slate-500">Baseline Method: </span>
                <span className="text-slate-800">14-Day EWMA Seasonal Baseline</span>
              </div>
            </div>
          </div>

          {/* Heterogeneous Data Sources Audit */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold uppercase tracking-wider text-[11px]">
              <Database className="w-4 h-4 text-slate-700" />
              <span>Reconciled Heterogeneous Sources</span>
            </div>

            <div className="space-y-2.5">
              {evidence.sources?.map((s, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 font-sans">{s.source}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      s.status === 'VERIFIED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {s.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[11px] text-slate-600">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Refresh Cadence</span>
                      <span>{s.cadence}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Freshness</span>
                      <span>{s.freshness}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Reliability</span>
                      <span>{s.reliability}</span>
                    </div>
                  </div>
                  <div className="pt-1 text-[11px] text-slate-500 font-mono">
                    Audited: {s.records_analyzed}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Analytical Methods Applied */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold uppercase tracking-wider text-[11px]">
              <Cpu className="w-4 h-4 text-slate-700" />
              <span>Deterministic Analytical Methods</span>
            </div>
            <ul className="space-y-1.5 list-disc list-inside bg-slate-50 p-3 rounded border border-slate-200 font-mono text-xs">
              {evidence.analytical_methods?.map((m, idx) => (
                <li key={idx} className="text-slate-800">{m}</li>
              ))}
            </ul>
          </div>

          {/* Supporting vs Contradictory Evidence */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold uppercase tracking-wider text-[11px]">
              <ShieldCheck className="w-4 h-4 text-slate-700" />
              <span>Corroboration & Epistemic Audit</span>
            </div>

            <div className="space-y-2">
              <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded text-emerald-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Direct Supporting Corroboration</span>
                </div>
                <p className="text-xs">
                  Inventory WMS snapshots confirm 0 available units across 14 top-selling SKUs in North Hub, precisely matching the 64% volume decline in North Region sales transactions.
                </p>
              </div>

              {evidence.contradictions?.has_contradictions ? (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded text-amber-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-800">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Active Cross-Source Contradiction</span>
                  </div>
                  <p className="text-xs">
                    Marketing pixel reports high conversions, but core transaction ledger registers conversion drop. Telemetry flagged with 26.5h sync lag.
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded text-slate-600">
                  No material cross-source contradictions detected for this operational slice.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs font-mono text-slate-500">
          <span>Epistemological Verification: PASSED</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded transition-colors"
          >
            Close Drawer
          </button>
        </div>

      </div>
    </div>
  );
}
