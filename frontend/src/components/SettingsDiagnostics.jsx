import React from 'react';
import { 
  X, 
  Cpu, 
  Activity, 
  ShieldCheck, 
  Lock, 
  Database, 
  Zap,
  CheckCircle2,
  Sliders
} from 'lucide-react';

export default function SettingsDiagnostics({ role, setRole, persona, setPersona, onClose }) {
  const roles = [
    { id: 'cfo', name: 'Chief Financial Officer (CFO)', desc: 'Full executive visibility over revenue, margins, and financial risks.' },
    { id: 'operations_manager', name: 'Operations & Logistics Lead', desc: 'SKU fulfillment, warehouse logistics, and lead times. Financial margins are masked.' },
    { id: 'marketing_director', name: 'Director of Performance Marketing', desc: 'Campaign spend, CAC, and conversion funnels. Warehouse logistics and margins are masked.' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-gray-900/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-gray-200">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-teal-800" />
            <h3 className="text-sm font-bold text-gray-900">
              System Settings & Local Engine Diagnostics
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-gray-400 hover:text-gray-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-xs text-gray-700">
          
          {/* Persona & Role Switcher */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-gray-900 uppercase tracking-wider block">
              Active User Role & RBAC Policy
            </span>

            <div className="space-y-2">
              {roles.map((r) => {
                const isSelected = role === r.id;
                return (
                  <div
                    key={r.id}
                    onClick={() => {
                      setRole(r.id);
                      setPersona(r.id);
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-teal-50/40 border-teal-700 shadow-xs'
                        : 'bg-gray-50 hover:bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-gray-900 text-xs">{r.name}</span>
                      {isSelected && (
                        <span className="text-[10px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-[11px] leading-relaxed">{r.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Local Computational Capabilities (Section 13) */}
          <div className="paisaan-card p-4 space-y-3 bg-gray-50/40">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <span className="text-xs font-bold text-gray-900 uppercase tracking-wider font-mono">
                Paisaan Intelligence Engine Telemetry
              </span>
              <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                OPTIMAL
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-2.5 bg-white rounded-lg border border-gray-200">
                <span className="text-[10px] text-gray-400 block uppercase">Local Analysis Latency</span>
                <span className="font-bold text-gray-900">48 ms</span>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-gray-200">
                <span className="text-[10px] text-gray-400 block uppercase">Simulation Runtime</span>
                <span className="font-bold text-gray-900">120 ms</span>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-gray-200">
                <span className="text-[10px] text-gray-400 block uppercase">Data Processed</span>
                <span className="font-bold text-gray-900">190,673 events</span>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-gray-200">
                <span className="text-[10px] text-gray-400 block uppercase">Model Confidence</span>
                <span className="font-bold text-teal-800">95%</span>
              </div>
            </div>

            <div className="text-[11px] text-gray-500 font-sans pt-1">
              Deterministic calculations and variance decomposition execute locally with sub-second responsiveness.
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-lg"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
