import React, { useState } from 'react';
import { 
  CheckSquare, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Truck, 
  Zap,
  Sliders,
  Sparkles
} from 'lucide-react';

export default function DecisionCenter({ onOpenScenarios }) {
  const [decisions, setDecisions] = useState([
    {
      id: "DEC_01",
      title: "Reallocate Inventory: West Central Hub → North Distribution Hub",
      situation: "North Hub availability collapsed to 71% due to port delays; West Central Hub has 140% surplus cover.",
      action: "Authorize express inter-DC line-haul transfer of 1,570 units across top 14 revenue-critical SKUs from Mumbai to Delhi-NCR.",
      expected_impact: "₹1.4 Cr – ₹1.9 Cr Protected Revenue (+7.4% On-shelf Fulfillment)",
      risk: "Low (Internal warehouse-to-warehouse stock transfer)",
      confidence_pct: 91,
      owner: "VP Global Supply Chain",
      monitoring_plan: "North Hub On-shelf Availability ≥ 92.0% within 72 Hours (Hourly WMS audit)",
      status: "PENDING" // 'PENDING', 'APPROVED', 'REJECTED'
    },
    {
      id: "DEC_02",
      title: "Activate Secondary Payment Gateway Failover Rail",
      situation: "Primary payment gateway timeout error rate spiked to 4.8% during evening checkout peak.",
      action: "Re-route 60% of web/app checkout sessions to Razorpay/Stripe secondary backup rails with auto-retry enabled.",
      expected_impact: "₹0.9 Cr Protected GMV (Prevents ~3,200 checkout abandonments)",
      risk: "Very Low (Pre-integrated failover pipeline)",
      confidence_pct: 88,
      owner: "Head of Engineering & Payments",
      monitoring_plan: "Gateway Error Rate < 0.8% within 4 Hours",
      status: "PENDING"
    },
    {
      id: "DEC_03",
      title: "Deploy Value-Add Warranty Bundling (South Region)",
      situation: "Competitor launched 12% flash sale in South audio and smart accessories category.",
      action: "Bundle vulnerable SKUs with free 2-year extended warranty and paired accessory at price parity rather than entering destructive price war.",
      expected_impact: "₹0.6 Cr Margin Protection",
      risk: "Medium (Promotion execution)",
      confidence_pct: 79,
      owner: "Director of Growth & Pricing",
      monitoring_plan: "South Region Conversion Share ≥ Baseline over 5 Days",
      status: "PENDING"
    }
  ]);

  const handleDecisionState = (id, newStatus) => {
    setDecisions(prev => prev.map(d => d.id === id ? { ...d, status: newStatus } : d));
  };

  return (
    <div className="space-y-5 pb-20 md:pb-6">
      
      {/* Header */}
      <div className="paisaan-card p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Decision Center
          </span>
          <h2 className="text-lg font-bold text-gray-900 mt-1">
            Active Decision & Intervention Pipeline
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Structured decisions linked directly to controllable business levers with audited 72-hour validation targets.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 bg-teal-50 text-teal-800 rounded-md font-bold border border-teal-200">
            {decisions.filter(d => d.status === 'APPROVED').length} Approved
          </span>
          <span className="px-2.5 py-1 bg-amber-50 text-amber-800 rounded-md font-bold border border-amber-200">
            {decisions.filter(d => d.status === 'PENDING').length} Pending Review
          </span>
        </div>
      </div>

      {/* Decision Cards Flow */}
      <div className="space-y-4">
        {decisions.map((dec) => {
          const isApproved = dec.status === 'APPROVED';
          const isRejected = dec.status === 'REJECTED';

          return (
            <div 
              key={dec.id} 
              className={`paisaan-card p-5 space-y-4 transition-all ${
                isApproved ? 'border-teal-300 bg-teal-50/10' :
                isRejected ? 'border-gray-200 opacity-60' : ''
              }`}
            >
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-2 pb-2 border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase text-gray-400">
                      Decision {dec.id}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                      Confidence: {dec.confidence_pct}%
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mt-1">
                    {dec.title}
                  </h3>
                </div>

                <div>
                  {isApproved ? (
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approved & Executing</span>
                    </span>
                  ) : isRejected ? (
                    <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-700 font-bold text-xs flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Rejected</span>
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs">
                      Awaiting Approval
                    </span>
                  )}
                </div>
              </div>

              {/* Decision Flow: Situation -> Action -> Impact -> Risk */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                
                <div className="p-3 bg-gray-50 rounded-lg space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">
                    1. Current Situation (Why?)
                  </span>
                  <p className="text-gray-800">{dec.situation}</p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg space-y-1">
                  <span className="text-[10px] text-teal-700 uppercase font-bold block">
                    2. Recommended Action
                  </span>
                  <p className="text-gray-800 font-medium">{dec.action}</p>
                </div>

                <div className="p-3 bg-emerald-50/40 border border-emerald-100 rounded-lg space-y-1">
                  <span className="text-[10px] text-emerald-800 uppercase font-bold block">
                    3. Expected Impact
                  </span>
                  <p className="text-emerald-950 font-bold font-mono text-xs">{dec.expected_impact}</p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">
                    4. Risk & Owner
                  </span>
                  <p className="text-gray-800">Risk: <span className="font-semibold">{dec.risk}</span> · Owner: <span className="font-semibold">{dec.owner}</span></p>
                </div>

              </div>

              {/* 72h Verification Plan */}
              <div className="p-3 bg-gray-50/80 rounded-lg border border-gray-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div>
                  <span className="font-bold text-gray-700">72-Hour Target SLA: </span>
                  <span className="font-mono text-gray-800">{dec.monitoring_plan}</span>
                </div>
                <span className="text-[10px] text-gray-400 font-mono">Automated Telemetry Verification</span>
              </div>

              {/* Decision Action Buttons */}
              {dec.status === 'PENDING' && (
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={onOpenScenarios}
                    className="text-xs font-semibold text-teal-800 hover:text-teal-950 flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Simulate "What If?" First</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDecisionState(dec.id, 'REJECTED')}
                      className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold text-xs transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleDecisionState(dec.id, 'APPROVED')}
                      className="px-4 py-1.5 rounded-lg bg-teal-800 hover:bg-teal-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve Decision</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
