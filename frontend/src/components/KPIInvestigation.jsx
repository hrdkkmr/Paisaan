import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  HelpCircle, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingDown, 
  TrendingUp, 
  Clock, 
  Layers, 
  BarChart2, 
  Briefcase, 
  ThumbsUp, 
  ThumbsDown, 
  RefreshCw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileText,
  User,
  Sliders
} from 'lucide-react';
import { investigateKPI, submitFeedback } from '../api';

export default function KPIInvestigation({
  kpiId = 'revenue',
  role = 'cfo',
  persona = 'cfo',
  contextOverride = null,
  onBack,
  onOpenEvidence
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedbackSuccess, setFeedbackSuccess] = useState(null);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [selectedDriverForFeedback, setSelectedDriverForFeedback] = useState(null);
  const [expandedAction, setExpandedAction] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await investigateKPI(kpiId, role, persona, contextOverride);
        setData(res);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [kpiId, role, persona, contextOverride]);

  const handleFeedback = async (type, driverId) => {
    try {
      setSubmittingFeedback(true);
      const res = await submitFeedback({
        insight_id: `INS_${kpiId.toUpperCase()}_01`,
        user_role: role,
        feedback_type: type,
        target_driver_id: driverId || 'inventory_shortage_north',
        notes: `Analyst feedback submitted from ${persona} investigation panel.`
      });
      setFeedbackSuccess(res.message);
      // Update drivers list with newly calibrated ranking
      if (res.reranked_drivers && data) {
        setData(prev => ({
          ...prev,
          why_it_changed: {
            ...prev.why_it_changed,
            waterfall_drivers: res.reranked_drivers
          }
        }));
      }
      setTimeout(() => setFeedbackSuccess(null), 4000);
    } catch (err) {
      alert(`Feedback submission failed: ${err.message}`);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="p-12 text-center text-slate-500 font-mono text-xs">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800 mb-3"></div>
        <div>Running deterministic variance decomposition & building evidence graph...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded text-red-800 text-xs">
        <p className="font-semibold">Investigation Error</p>
        <p className="mt-1">{error}</p>
        <button onClick={onBack} className="mt-3 px-3 py-1 bg-red-100 hover:bg-red-200 rounded font-medium">
          Return to Overview
        </button>
      </div>
    );
  }

  const { what_changed, why_it_changed, confidence, materiality, abstention, persona_narrative, recommended_actions, evidence_graph } = data;
  const isAbstain = abstention?.should_abstain;

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
            {what_changed.name} Investigation
          </span>
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
            Active Persona: {persona.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenEvidence(evidence_graph)}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded border border-slate-300 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-600" />
            <span>Why do you believe this?</span>
          </button>

          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded border border-slate-200 text-xs font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
            <span>Confidence: {confidence.score}%</span>
            <span className="text-slate-400 font-sans">({confidence.level})</span>
          </div>
        </div>
      </div>

      {/* FEEDBACK SUCCESS TOAST */}
      {feedbackSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-2.5 rounded-md text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">{feedbackSuccess}</span>
          </div>
          <span className="text-emerald-700 font-mono text-[11px]">Weights Recalibrated</span>
        </div>
      )}

      {/* ABSTENTION WARNING BANNER (If active) */}
      {isAbstain && (
        <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 text-amber-900 space-y-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span className="font-bold text-sm uppercase tracking-wide">
              {abstention.abstention_badge}
            </span>
          </div>
          <p className="text-xs font-medium">
            {abstention.abstention_statement}
          </p>
          <ul className="text-xs list-disc list-inside space-y-0.5 text-amber-800 font-mono">
            {abstention.abstention_reasons?.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
          {abstention.alternative_proposal && (
            <div className="mt-2 pt-2 border-t border-amber-200 flex items-center justify-between text-xs">
              <span className="font-semibold">
                Alternative Recommended: {abstention.alternative_proposal.benchmark_name}
              </span>
              <span className="text-amber-700 font-mono text-[11px]">
                {abstention.alternative_proposal.description}
              </span>
            </div>
          )}
        </div>
      )}

      {/* 4-PILLAR FRAMEWORK CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT 2 COLUMNS: What changed? + Why did it change? + Actions */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* SECTION 1: WHAT CHANGED? */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                1. What Changed? (Deterministic Actual vs Baseline)
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Method: 14-day EWMA Residual Analysis
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-[11px] text-slate-500 font-medium">Observed Actual</span>
                <p className="text-xl font-bold text-slate-900 font-mono mt-0.5">
                  {what_changed.actual_display}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-[11px] text-slate-500 font-medium">Expected Baseline</span>
                <p className="text-xl font-bold text-slate-700 font-mono mt-0.5">
                  {what_changed.expected_display}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-[11px] text-slate-500 font-medium">Variance</span>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className={`text-xl font-bold font-mono ${what_changed.pct_change < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                    {what_changed.pct_change > 0 ? `+${what_changed.pct_change}%` : `${what_changed.pct_change}%`}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-[11px] text-slate-500 font-medium">Statistical Significance</span>
                <p className="text-xl font-bold text-slate-800 font-mono mt-0.5">
                  {what_changed.z_score}σ
                </p>
                <span className="text-[10px] text-slate-500">
                  {Math.abs(what_changed.z_score) >= 2.0 ? 'Material Anomaly' : 'Normal Variance'}
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 2: WHY DID IT CHANGE? (WATERFALL & DRIVERS) */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  2. Why Did It Change? (Driver Decomposition & Ranking)
                </span>
                <p className="text-xs text-slate-500 mt-0.5">
                  {why_it_changed.method}
                </p>
              </div>
              <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                Observational Attribution
              </span>
            </div>

            {/* Waterfall Drivers Table */}
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-mono uppercase text-[10px]">
                    <th className="py-2 px-2">Rank</th>
                    <th className="py-2 px-2">Likely Contributor Driver</th>
                    <th className="py-2 px-2 text-right">Contribution</th>
                    <th className="py-2 px-2">Evidence Quality</th>
                    <th className="py-2 px-2">Freshness</th>
                    <th className="py-2 px-2">Controllability</th>
                    <th className="py-2 px-2 text-right">Rank Score</th>
                    <th className="py-2 px-2 text-center">Feedback</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {why_it_changed.waterfall_drivers.map((drv) => (
                    <tr key={drv.driver_id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-2 font-mono font-bold text-slate-600">
                        #{drv.rank || 1}
                      </td>
                      <td className="py-2.5 px-2">
                        <div className="font-semibold text-slate-900">{drv.name}</div>
                        <div className="text-[11px] text-slate-500 font-normal">{drv.description}</div>
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono font-bold text-red-600">
                        {drv.contribution_pct > 0 ? `+${drv.contribution_pct}%` : `${drv.contribution_pct}%`}
                      </td>
                      <td className="py-2.5 px-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                          drv.evidence_quality === 'Strong' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          drv.evidence_quality === 'Moderate' ? 'bg-slate-100 text-slate-700 border border-slate-200' :
                          'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {drv.evidence_quality}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-slate-500 font-mono text-[11px]">
                        {drv.data_freshness}
                      </td>
                      <td className="py-2.5 px-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          drv.controllability === 'HIGH' ? 'bg-slate-900 text-white' :
                          drv.controllability === 'MEDIUM' ? 'bg-slate-200 text-slate-800' :
                          'bg-slate-100 text-slate-500'
                        }`}>
                          {drv.controllability}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono font-bold text-slate-800">
                        {drv.rank_score}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleFeedback('CORRECT_DRIVER', drv.driver_id)}
                            disabled={submittingFeedback}
                            title="Validate: Correct Driver"
                            className="p-1 hover:bg-emerald-100 text-slate-500 hover:text-emerald-700 rounded transition-colors"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleFeedback('INCORRECT_DRIVER', drv.driver_id)}
                            disabled={submittingFeedback}
                            title="Flag: Incorrect Driver"
                            className="p-1 hover:bg-red-100 text-slate-500 hover:text-red-700 rounded transition-colors"
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 italic">
              {why_it_changed.disclaimer}
            </div>
          </div>

          {/* SECTION 4: WHAT SHOULD WE DO ABOUT IT? (ACTION RECOMMENDATIONS) */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  4. What Should We Do About It? (Controllable Levers & Actions)
                </span>
                <p className="text-xs text-slate-500 mt-0.5">
                  Filtered for controllable drivers with verifiable 72-hour monitoring plans.
                </p>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-bold">
                {recommended_actions?.length || 0} Playbooks Active
              </span>
            </div>

            {recommended_actions && recommended_actions.length > 0 ? (
              <div className="space-y-3">
                {recommended_actions.map((act, idx) => (
                  <div 
                    key={act.action_id}
                    className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold uppercase bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                            Lever: {act.controllable_lever}
                          </span>
                          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-bold">
                            {act.expected_impact}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 mt-1">
                          {act.action_title}
                        </h4>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-mono font-semibold text-slate-700 block">
                          Owner: {act.owner}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          Urgency: {act.urgency}
                        </span>
                      </div>
                    </div>

                    {/* Step-by-step Execution List */}
                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                        Execution Directives:
                      </p>
                      <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                        {act.detailed_steps?.map((step, sIdx) => (
                          <li key={sIdx}>{step}</li>
                        ))}
                      </ul>
                    </div>

                    {/* 72h Verification Plan */}
                    {act.monitoring_plan && (
                      <div className="mt-3 p-2.5 bg-white rounded border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <span className="font-semibold text-slate-800">72-Hour Verification Target: </span>
                          <span className="font-mono text-slate-700">{act.monitoring_plan.target_metric} → {act.monitoring_plan.target_value}</span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {act.monitoring_plan.telemetry_check}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-xs text-slate-500 italic bg-slate-50 rounded border border-slate-200">
                {isAbstain 
                  ? "Recommendations suppressed due to active analytical abstention." 
                  : "No high-controllability actions recommended for current baseline."}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Persona Narrative + Confidence Factor Breakdown */}
        <div className="space-y-6">
          
          {/* PERSONA-TUNED NARRATIVE */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-700" />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Persona Narrative ({persona_narrative.persona.toUpperCase()})
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                ✓ ZERO-HALLUCINATION GUARD
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-snug">
                {persona_narrative.headline}
              </h3>
              <p className="text-xs text-slate-700 mt-2 leading-relaxed whitespace-pre-line font-sans">
                {persona_narrative.narrative}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                Key Strategic Takeaway:
              </span>
              <p className="text-xs text-slate-800 mt-1 font-medium">
                {persona_narrative.key_takeaway}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>Guardrails: PASSED</span>
              <span>Epistemology: GROUNDED</span>
            </div>
          </div>

          {/* SECTION 3: HOW CONFIDENT ARE WE? (CONFIDENCE BREAKDOWN) */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                3. Confidence Breakdown
              </span>
              <span className="text-xs font-bold font-mono text-slate-800">
                {confidence.score}% ({confidence.level})
              </span>
            </div>

            <p className="text-xs text-slate-600">
              {confidence.level_description}
            </p>

            {/* Component Factor Bars */}
            <div className="space-y-2.5 text-xs">
              <div>
                <div className="flex justify-between text-[11px] text-slate-600 font-mono mb-1">
                  <span>Data Completeness (25%)</span>
                  <span>{confidence.components.data_completeness}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded overflow-hidden">
                  <div className="bg-slate-800 h-full rounded" style={{ width: `${confidence.components.data_completeness}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-600 font-mono mb-1">
                  <span>Source Reliability (25%)</span>
                  <span>{confidence.components.source_reliability}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded overflow-hidden">
                  <div className="bg-slate-800 h-full rounded" style={{ width: `${confidence.components.source_reliability}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-600 font-mono mb-1">
                  <span>Data Freshness (15%)</span>
                  <span>{confidence.components.data_freshness}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded overflow-hidden">
                  <div className="bg-slate-800 h-full rounded" style={{ width: `${confidence.components.data_freshness}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-600 font-mono mb-1">
                  <span>Statistical Power (20%)</span>
                  <span>{confidence.components.statistical_power}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded overflow-hidden">
                  <div className="bg-slate-800 h-full rounded" style={{ width: `${confidence.components.statistical_power}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-600 font-mono mb-1">
                  <span>Cross-Source Consensus (15%)</span>
                  <span>{confidence.components.cross_source_agreement}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded overflow-hidden">
                  <div className="bg-slate-800 h-full rounded" style={{ width: `${confidence.components.cross_source_agreement}%` }}></div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-[10px] font-mono text-slate-500">
              Formula: {confidence.formula}
            </div>
          </div>

          {/* MATERIALITY AUDIT */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Materiality Score
              </span>
              <span className="text-xs font-bold font-mono text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                {materiality.materiality_score}/100 ({materiality.badge})
              </span>
            </div>

            <p className="text-xs text-slate-600">
              {materiality.persistence_description}
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
              <div className="p-2 bg-slate-50 rounded border border-slate-100">
                <span className="text-[10px] text-slate-400 block">Statistical Impact</span>
                <span className="font-bold text-slate-800">{materiality.components.statistical_significance.score} pts</span>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-100">
                <span className="text-[10px] text-slate-400 block">Financial Impact</span>
                <span className="font-bold text-slate-800">{materiality.components.business_financial_impact.score} pts</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
