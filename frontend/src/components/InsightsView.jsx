import React, { useState } from 'react';
import { 
  Lightbulb, 
  HelpCircle, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingDown, 
  ArrowRight,
  BarChart2,
  GitBranch,
  Layers,
  Database,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Cpu
} from 'lucide-react';
import { submitFeedback } from '../api';

export default function InsightsView({
  investigationData,
  onOpenEvidenceDrawer,
  onOpenDecisions,
  role = 'cfo',
  persona = 'cfo'
}) {
  const [activeTab, setActiveTab] = useState('explanation'); // 'explanation', 'prediction', 'evidence_check', 'limited_history'
  const [feedbackToast, setFeedbackToast] = useState(null);

  const data = investigationData || {
    what_changed: {
      name: "Gross Realized Revenue",
      actual_display: "₹4.82 Cr",
      expected_display: "₹5.46 Cr",
      pct_change: -11.8,
      z_score: -2.8
    },
    why_it_changed: {
      waterfall_drivers: [
        { driver_id: "volume_decline", name: "Order & Units Volume Contraction", contribution_pct: -5.4, evidence_quality: "Strong", data_freshness: "0.5h ago", controllability: "HIGH", rank_score: 91.2, description: "Unfulfilled customer orders in North region due to supply bottlenecks." },
        { driver_id: "product_mix_shift", name: "Product Mix Shift (Lower-ticket share)", contribution_pct: -3.1, evidence_quality: "Moderate", data_freshness: "1.0h ago", controllability: "MEDIUM", rank_score: 74.5, description: "Customer mix shifted to lower-margin apparel items." },
        { driver_id: "inventory_shortage_north", name: "North Hub Stockout & Port Delay", contribution_pct: -2.2, evidence_quality: "Strong", data_freshness: "4.5h ago", controllability: "HIGH", rank_score: 86.4, description: "14 high-AOV electronics SKUs completely out of stock." },
        { driver_id: "marketing_efficiency_east", name: "East Region Marketing Conversion Drag", contribution_pct: -0.8, evidence_quality: "Conflicted", data_freshness: "26.5h ago", controllability: "HIGH", rank_score: 52.1, description: "Ad platform pixel double-firing with 26.5h synchronization lag." },
        { driver_id: "macro_competition_south", name: "South Competitor Price Discounting", contribution_pct: -0.3, evidence_quality: "Moderate", data_freshness: "10.5h ago", controllability: "LOW", rank_score: 44.0, description: "Competitor 12% price reduction in South audio segment." }
      ]
    },
    confidence: {
      score: 86,
      level: "HIGH",
      level_description: "Strong multi-source corroboration between sales orders and WMS inventory snapshots."
    }
  };

  const handleFeedback = async (type, driverId) => {
    try {
      await submitFeedback({
        insight_id: "INS_PAISAAN_01",
        user_role: role,
        feedback_type: type,
        target_driver_id: driverId
      });
      setFeedbackToast(type === 'CORRECT_DRIVER' ? 'Driver validated. Weight boosted.' : 'Driver flagged. Weight penalized.');
      setTimeout(() => setFeedbackToast(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-5 pb-20 md:pb-6">
      
      {/* Header & Sub-Navigation */}
      <div className="paisaan-card p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Intelligence Center
          </span>
          <h2 className="text-lg font-bold text-gray-900 mt-1">
            Root Drivers, Predictions & Evidence
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Clear separation between Observation, Explanation, Prediction, and Confidence.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-lg text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('explanation')}
            className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
              activeTab === 'explanation' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Explanation (Why?)
          </button>
          <button
            onClick={() => setActiveTab('prediction')}
            className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
              activeTab === 'prediction' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Prediction (Risk)
          </button>
          <button
            onClick={() => setActiveTab('evidence_check')}
            className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
              activeTab === 'evidence_check' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Evidence Check
          </button>
          <button
            onClick={() => setActiveTab('limited_history')}
            className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
              activeTab === 'limited_history' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Limited History
          </button>
        </div>
      </div>

      {feedbackToast && (
        <div className="bg-teal-50 border border-teal-200 text-teal-900 px-4 py-2 rounded-lg text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-600" />
          <span className="font-semibold">{feedbackToast}</span>
        </div>
      )}

      {/* TAB 1: EXPLANATION (WHY DID THIS CHANGE?) */}
      {activeTab === 'explanation' && (
        <div className="space-y-4">
          
          {/* LEVEL 1 & 2 SUMMARY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="paisaan-card p-4 bg-emerald-50/20 border-emerald-100">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                Level 1 · Observation ("What happened?")
              </span>
              <p className="text-sm font-bold text-gray-900 mt-1">
                Gross Revenue fell 11.8% below expected target (₹3.2 Cr gap, z = -2.8σ).
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Observed over a 7-day sustained trend across transactional sales ledgers.
              </p>
            </div>

            <div className="paisaan-card p-4 bg-blue-50/20 border-blue-100">
              <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">
                Level 2 · Explanation ("Why did it happen?")
              </span>
              <p className="text-sm font-bold text-gray-900 mt-1">
                Unit volume drop (-5.4%) and North Hub stockouts (-2.2%) account for the majority of the variance.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Verified through mathematical price-volume variance decomposition.
              </p>
            </div>
          </div>

          {/* WATERFALL DRIVER DECOMPOSITION TABLE */}
          <div className="paisaan-card p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Mathematical Driver Waterfall
                </span>
                <p className="text-xs text-gray-400 mt-0.5">Observational attribution — ranked by contribution and controllability</p>
              </div>
              <button
                onClick={onOpenEvidenceDrawer}
                className="text-xs font-semibold text-teal-800 hover:text-teal-950 flex items-center gap-1"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Why do you believe this?</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 uppercase text-[10px] font-mono">
                    <th className="py-2 px-2">Driver</th>
                    <th className="py-2 px-2 text-right">Contribution</th>
                    <th className="py-2 px-2">Evidence</th>
                    <th className="py-2 px-2">Controllability</th>
                    <th className="py-2 px-2 text-center">Validate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {data.why_it_changed.waterfall_drivers.map((drv) => (
                    <tr key={drv.driver_id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-2.5 px-2">
                        <div className="font-bold text-gray-900">{drv.name}</div>
                        <div className="text-[11px] text-gray-500 font-normal">{drv.description}</div>
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono font-bold text-red-700">
                        {drv.contribution_pct}%
                      </td>
                      <td className="py-2.5 px-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          drv.evidence_quality === 'Strong' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                          drv.evidence_quality === 'Moderate' ? 'bg-gray-100 text-gray-700' :
                          'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          {drv.evidence_quality}
                        </span>
                      </td>
                      <td className="py-2.5 px-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          drv.controllability === 'HIGH' ? 'bg-gray-900 text-white' :
                          drv.controllability === 'MEDIUM' ? 'bg-gray-200 text-gray-800' :
                          'bg-gray-100 text-gray-400'
                        }`}>
                          {drv.controllability}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleFeedback('CORRECT_DRIVER', drv.driver_id)}
                            className="p-1 hover:bg-emerald-50 text-gray-400 hover:text-emerald-700 rounded transition-colors"
                            title="Validate driver"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleFeedback('INCORRECT_DRIVER', drv.driver_id)}
                            className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-700 rounded transition-colors"
                            title="Penalize driver"
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

            <div className="pt-2 flex items-center justify-between text-xs text-gray-500">
              <span className="italic text-[11px]">Causal claim disclaimer: Factors represent likely empirical contributors.</span>
              <button
                onClick={onOpenDecisions}
                className="px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-semibold text-xs transition-colors"
              >
                Go to Recommended Decision →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PREDICTION (RISK BEFORE ACTION) */}
      {activeTab === 'prediction' && (
        <div className="paisaan-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div>
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                Level 3 · Prediction ("What is likely to happen next?")
              </span>
              <h3 className="text-base font-bold text-gray-900 mt-1">
                Forward-Looking Risk Before Action: Q4 Target
              </h3>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-gray-400 block uppercase">Projected Risk</span>
              <span className="text-lg font-bold font-mono text-red-700">72% Probability</span>
            </div>
          </div>

          <p className="text-xs text-gray-600 leading-relaxed">
            Monte Carlo simulation across forward-looking supply and demand signals projects a potential <span className="font-bold text-gray-900">₹4.1 Cr revenue shortfall</span> if preventive interventions are not executed within 48 hours.
          </p>

          <div className="space-y-2.5 pt-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
              Leading Indicators (Warning Signals):
            </span>

            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-start justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-gray-900">1. Inbound Port Delay (+4.8 Days)</span>
                <p className="text-gray-500 text-[11px] mt-0.5">Will deplete North & West stock cover in 9 days.</p>
              </div>
              <span className="font-mono font-bold text-red-700 shrink-0">34% Risk Weight</span>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-start justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-gray-900">2. Checkout Payment Gateway Latency (4.8% Error Rate)</span>
                <p className="text-gray-500 text-[11px] mt-0.5">Spike in cart abandonments during peak evening traffic.</p>
              </div>
              <span className="font-mono font-bold text-amber-700 shrink-0">27% Risk Weight</span>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-start justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-gray-900">3. South Region Competitor 12% Price Cut</span>
                <p className="text-gray-500 text-[11px] mt-0.5">Price elasticity causing conversion leakage in audio SKUs.</p>
              </div>
              <span className="font-mono font-bold text-gray-700 shrink-0">21% Risk Weight</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EVIDENCE CHECK (CONTRADICTION & ABSTENTION) */}
      {activeTab === 'evidence_check' && (
        <div className="paisaan-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Evidence Check & Contradiction Audit
              </span>
              <p className="text-xs text-gray-400 mt-0.5">Verifying data integrity across heterogeneous streams</p>
            </div>
            <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded font-mono text-xs font-bold">
              Confidence: 38% (Capped)
            </span>
          </div>

          <div className="p-4 bg-amber-50/40 border border-amber-200 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Contradiction Detected: Ad Pixel vs Direct Transaction Ledger</span>
            </div>
            <p className="text-xs text-gray-700 leading-relaxed">
              Marketing pixel claims <span className="font-semibold">+18% CTR</span> and attributes ₹1.4 Cr revenue, while direct sales orders record a <span className="font-semibold text-red-700">-42% conversion collapse</span> with a 26.5h pixel synchronization lag.
            </p>
            <div className="p-3 bg-white rounded border border-amber-200 text-xs font-mono text-gray-800">
              <span className="font-bold text-amber-900 block mb-1">SYSTEM DECISION: EXPLICIT ABSTENTION</span>
              "Paisaan cannot confidently determine whether marketing contributed to the revenue decline due to stale attribution telemetry. Action recommendations on ad budgets are suppressed."
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LIMITED HISTORY (SMARTPHONE X) */}
      {activeTab === 'limited_history' && (
        <div className="paisaan-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Limited History Handling: PROD_SMARTPHONE_X
              </span>
              <p className="text-xs text-gray-400 mt-0.5">New product launched 17 days ago</p>
            </div>
            <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded font-mono text-xs font-bold">
              Confidence: 31%
            </span>
          </div>

          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-2 text-xs">
            <h4 className="font-bold text-gray-900">
              Governed Protocol for Sparse Historical Coverage:
            </h4>
            <p className="text-gray-600 leading-relaxed">
              Because this product possesses only 17 days of transactional history (minimum 60 days required for time-series forecasting), Paisaan <span className="font-bold text-gray-900">explicitly abstains from fabricating an ARIMA or seasonal baseline</span>.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Instead, Paisaan substitutes the <span className="font-semibold text-teal-800">Electronics Category Median Run-Rate Benchmark</span> and flags the confidence score at 31%.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
