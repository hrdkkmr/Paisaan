import React from 'react';
import { 
  X, 
  GitBranch, 
  Database, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  FileCode2,
  Cpu
} from 'lucide-react';

export default function EvidenceDrawer({ onClose }) {
  const sources = [
    {
      name: "Sales Transaction Ledger",
      cadence: "Hourly",
      freshness: "30m ago",
      status: "VERIFIED",
      reliability: "98%",
      records: "190,673 transactions",
      desc: "Direct transactional order records containing line-item prices, quantities, and realized revenue."
    },
    {
      name: "Warehouse Management System (WMS)",
      cadence: "6-Hourly",
      freshness: "4.5h ago",
      status: "VERIFIED",
      reliability: "94%",
      records: "7,232 SKU-hub snapshots",
      desc: "Physical stock levels, replenishment delays, and SKU stockout flags across North and West Hubs."
    },
    {
      name: "Marketing Ad Platform Telemetry",
      cadence: "Daily",
      freshness: "26.5h ago (Attribution Lag)",
      status: "FLAGGED_LAG",
      reliability: "76%",
      records: "992 campaign rows",
      desc: "Attributed ad revenue and clickstream telemetry (flagged with pixel synchronization delay in East region)."
    }
  ];

  const methods = [
    "Deterministic Price-Volume Variance Decomposition (Fisher-LMDI)",
    "Unfulfilled SKU-Demand Stockout Loss Quantification",
    "14-Day EWMA Seasonal Baseline Deviation Model",
    "Multi-factor Controllability Gating"
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-gray-900/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-gray-200">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-teal-800" />
            <div>
              <h3 className="text-sm font-bold text-gray-900">
                Traceable Evidence & Provenance
              </h3>
              <p className="text-[11px] text-gray-500 font-mono">
                Why Paisaan believes Gross Revenue fell 11.8%
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-gray-400 hover:text-gray-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 text-xs text-gray-700">
          
          {/* Question Callout */}
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Audited Business Claim:
            </span>
            <p className="text-xs font-semibold text-gray-900 mt-0.5">
              "Revenue variance (-11.8%) is driven primarily by North Distribution Hub supply bottlenecks affecting 14 high-AOV SKUs."
            </p>
          </div>

          {/* Reconciled Sources */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-gray-900 uppercase tracking-wider block">
              Reconciled Heterogeneous Sources
            </span>

            {sources.map((s, idx) => (
              <div key={idx} className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900 text-xs">{s.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                    s.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {s.status}
                  </span>
                </div>

                <p className="text-gray-500 text-[11px] leading-relaxed">
                  {s.desc}
                </p>

                <div className="grid grid-cols-3 gap-2 pt-1 border-t border-gray-200/60 font-mono text-[10px] text-gray-600">
                  <div>
                    <span className="text-gray-400 block">Cadence</span>
                    <span>{s.cadence}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Freshness</span>
                    <span>{s.freshness}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Reliability</span>
                    <span>{s.reliability}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Analytical Methods */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-gray-900 uppercase tracking-wider block">
              Applied Deterministic Analytics
            </span>
            <ul className="space-y-1.5 list-disc list-inside bg-gray-50 p-3 rounded-lg border border-gray-200 text-gray-800 font-mono text-[11px]">
              {methods.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </div>

          {/* Epistemic Verification */}
          <div className="p-3.5 bg-emerald-50/50 border border-emerald-200 rounded-xl text-xs space-y-1 text-emerald-950">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Multi-Source Corroboration Verified</span>
            </div>
            <p className="text-[11px] leading-relaxed text-emerald-900">
              WMS physical stock counts (0 units in North Hub) corroborate the 64% volume decline in North Region sales transactions.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-lg"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
