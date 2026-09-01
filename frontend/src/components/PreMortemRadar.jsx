import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  TrendingDown, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Zap, 
  ArrowRight,
  Sparkles,
  BarChart3,
  Calendar,
  UserCheck
} from 'lucide-react';
import { getFinancialPreMortem } from '../api';

export default function PreMortemRadar({ role, persona, onExecuteAction }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await getFinancialPreMortem(role, persona);
        setData(res);
        setError(null);
      } catch (err) {
        setError(err.message);
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
        <div>Running forward-looking Monte Carlo simulation & synthesizing leading indicators...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded text-red-800 text-xs">
        <p className="font-semibold">Pre-Mortem Radar Error</p>
        <p className="mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner: Proactive Risk Radar */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 text-[11px] font-bold font-mono uppercase tracking-wider">
              PROACTIVE PRE-MORTEM RADAR
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Horizon: Next 30 Days (Q4 Target)
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Financial Pre-Mortem: Q4 Gross Realized Revenue Target
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Detecting forward-looking leading indicator signals before bottom-line financial degradation occurs.
          </p>
        </div>

        {/* Risk Probability Badge */}
        <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-500 font-mono block">
              Failure Probability
            </span>
            <span className="text-2xl font-bold font-mono text-red-600">
              {data.risk_probability_pct}%
            </span>
          </div>

          <div className="h-8 w-[1px] bg-slate-200"></div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 font-mono block">
              Projected Shortfall
            </span>
            <span className="text-xl font-bold font-mono text-slate-900">
              {data.expected_shortfall_display}
            </span>
          </div>
        </div>
      </div>

      {/* 2 COLUMN LAYOUT: Leading Indicators + Epistemology & Playbooks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT 2 COLUMNS: Leading Indicators Table */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* LEADING INDICATORS BREAKDOWN */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Weighted Leading Indicator Breakdown
                </span>
                <p className="text-xs text-slate-500 mt-0.5">
                  Signals derived from early WMS transit logs, checkout funnel telemetry, and market indices.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                Model Confidence: {data.confidence_score}%
              </span>
            </div>

            <div className="space-y-3">
              {data.leading_indicators?.map((ind) => (
                <div 
                  key={ind.indicator_id} 
                  className="border border-slate-200 rounded-lg p-4 bg-slate-50/60 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 font-sans">
                          {ind.name}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          ind.status === 'CRITICAL_ALERT' ? 'bg-red-50 text-red-700 border border-red-200' :
                          ind.status === 'WARNING' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {ind.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        Category: {ind.category} · Signal Type: {ind.signal_type}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-bold font-mono text-red-600 block">
                        {ind.weight_pct}% Risk Weight
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Conf: {ind.model_confidence_pct}%
                      </span>
                    </div>
                  </div>

                  {/* Observation vs Projected Failure Mode */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-200 text-xs">
                    <div className="p-2.5 bg-white rounded border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Current Leading Observation:
                      </span>
                      <p className="text-slate-800">{ind.current_observation}</p>
                    </div>

                    <div className="p-2.5 bg-white rounded border border-slate-200">
                      <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider block mb-1">
                        Projected Failure Mode:
                      </span>
                      <p className="text-slate-800 font-medium">{ind.projected_failure_mode}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PREVENTIVE ACTION PLAYBOOKS */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Proactive Preventive Playbooks (Execute Now)
                </span>
                <p className="text-xs text-slate-500 mt-0.5">
                  Interventions designed to mitigate projected shortfall before failure horizon is reached.
                </p>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-bold">
                {data.preventive_playbooks?.length} Playbooks Ready
              </span>
            </div>

            <div className="space-y-3">
              {data.preventive_playbooks?.map((pb) => (
                <div key={pb.playbook_id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-slate-500 uppercase">
                        Targeting: {pb.target_risk}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                        {pb.title}
                      </h4>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-100 text-emerald-800">
                      {pb.expected_risk_reduction}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    {pb.action}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-[11px] font-mono text-slate-600">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Execution Lead Time</span>
                      <span className="font-semibold text-slate-900">{pb.lead_time}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Accountable Owner</span>
                      <span className="font-semibold text-slate-900">{pb.owner}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Verification KPI</span>
                      <span className="font-semibold text-slate-900">{pb.verification_kpi}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Epistemological Breakdown (Facts vs Forecasts vs Hypotheses) */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Epistemological Rigor Matrix
              </span>
              <p className="text-xs text-slate-500 mt-0.5">
                Strict segregation of empirical facts, mathematical models, and speculative hypotheses.
              </p>
            </div>

            {/* Observed Facts */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>1. Observed Empirical Facts</span>
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700 bg-emerald-50/40 p-3 rounded border border-emerald-200 list-disc list-inside">
                {data.epistemological_breakdown?.observed_facts?.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>

            {/* Forecast Models */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                <BarChart3 className="w-3.5 h-3.5 text-slate-600" />
                <span>2. Forecast / Probabilistic Models</span>
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700 bg-slate-50 p-3 rounded border border-slate-200 list-disc list-inside">
                {data.epistemological_breakdown?.forecast_models?.map((fm, i) => (
                  <li key={i}>{fm}</li>
                ))}
              </ul>
            </div>

            {/* Hypotheses */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>3. Business Hypotheses</span>
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700 bg-amber-50/40 p-3 rounded border border-amber-200 list-disc list-inside">
                {data.epistemological_breakdown?.hypotheses?.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 font-mono">
              Enforcement: No forecast is presented as an observed fact.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
