import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  TrendingUp, 
  BarChart2, 
  HelpCircle 
} from 'lucide-react';
import { investigateKPI } from '../api';

export default function SparseHistoryView({ role, persona }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await investigateKPI('revenue', role, persona, 'sparse_history');
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [role, persona]);

  if (loading && !data) {
    return (
      <div className="p-12 text-center text-slate-500 font-mono text-xs">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800 mb-3"></div>
        <div>Evaluating historical baseline coverage for newly launched entities...</div>
      </div>
    );
  }

  const { what_changed, confidence, abstention, persona_narrative } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[11px] font-bold font-mono uppercase tracking-wider border border-slate-200">
              SCENARIO 3 — SPARSE HISTORY / NEW PRODUCT LAUNCH
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Product: PROD_SMARTPHONE_X
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Sparse History Handling: SmartPhone X (17-Day Active Baseline)
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Demonstrating why the engine refuses to fabricate time-series ARIMA/seasonal forecasts on newly launched SKUs, substituting category cohort benchmarks instead.
          </p>
        </div>

        <div className="text-right font-mono text-xs">
          <span className="text-slate-400 block text-[10px] uppercase">Active History Coverage</span>
          <span className="text-base font-bold text-slate-800">17 Days (Threshold: 60d)</span>
        </div>
      </div>

      {/* 2-Column Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Anti-Pattern: Fabricated Forecast */}
        <div className="bg-white border border-red-200 rounded-lg p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-red-100">
            <span className="text-xs font-bold text-red-700 uppercase tracking-wider font-mono">
              ✕ Generic AI Anti-Pattern (Fabrication)
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-50 text-red-700 border border-red-200">
              PROHIBITED
            </span>
          </div>
          <p className="text-xs text-slate-600">
            Generic AI assistants attempt to generate a confident 30-day forecast and seasonal anomaly analysis over only 17 days of data, inventing phantom trends and false seasonality.
          </p>
          <div className="p-3 bg-red-50/50 rounded border border-red-100 text-xs font-mono text-red-900 space-y-1">
            <div>• Time-series Degrees of Freedom: Insufficient</div>
            <div>• Risk of Spurious Anomaly Flags: &gt; 85%</div>
            <div>• Epistemic Grounding: FALSE</div>
          </div>
        </div>

        {/* Governed Grounded Pattern: Category Benchmark Substitution */}
        <div className="bg-white border border-emerald-200 rounded-lg p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider font-mono">
              ✓ Governed Analytical Protocol
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
              ENFORCED
            </span>
          </div>
          <p className="text-xs text-slate-600">
            The engine explicitly flags <span className="font-semibold">SPARSE_HISTORY</span>, caps confidence at 31%, abstains from time-series decomposition, and substitutes the <span className="font-semibold">Electronics Category Median Run-Rate Benchmark</span>.
          </p>
          <div className="p-3 bg-emerald-50/50 rounded border border-emerald-100 text-xs font-mono text-emerald-900 space-y-1">
            <div>• Decision: ABSTAIN from ARIMA / Seasonal EWMA</div>
            <div>• Substitute: Electronics Tier-1 Median Launch Curve</div>
            <div>• Confidence Score: 31% (Strictly Capped)</div>
          </div>
        </div>

      </div>

      {/* Persona Narrative Audit */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
          Governed Engine Narrative Output
        </span>
        <div className="p-4 bg-slate-50 rounded border border-slate-200 text-xs text-slate-800 leading-relaxed font-sans whitespace-pre-line">
          {persona_narrative.narrative}
        </div>
      </div>
    </div>
  );
}
