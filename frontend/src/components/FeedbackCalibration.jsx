import React, { useState } from 'react';
import { 
  UserCheck, 
  ThumbsUp, 
  ThumbsDown, 
  Sliders, 
  RotateCcw, 
  CheckCircle2, 
  BarChart2, 
  Clock 
} from 'lucide-react';
import { submitFeedback } from '../api';

export default function FeedbackCalibration({ role }) {
  const [feedbackHistory, setFeedbackHistory] = useState([
    {
      id: "FB_0001",
      driver: "North Hub Stockout & Inbound Port Delay",
      type: "CORRECT_DRIVER",
      user: "Senior Operations Analyst",
      notes: "Confirmed WMS physical stock count matches revenue impact.",
      timestamp: "2026-08-31 09:15:00",
      effect: "+0.08 Boost on WMS Inventory Evidence Factor"
    },
    {
      id: "FB_0002",
      driver: "East Region Marketing Conversion Drag",
      type: "INCORRECT_DRIVER",
      user: "Growth Lead",
      notes: "Pixel double-firing issue flagged. Ad platform attribution is noisy.",
      timestamp: "2026-08-31 08:45:00",
      effect: "-0.12 Penalty on Stale Pixel Factor; Increased Freshness Weight"
    }
  ]);

  const [weights, setWeights] = useState({
    contribution: 0.33,
    evidence_quality: 0.22,
    statistical_strength: 0.15,
    controllability: 0.15,
    freshness: 0.15
  });

  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSimulateFeedback = async (driverId, driverName, type) => {
    try {
      setSubmitting(true);
      const res = await submitFeedback({
        insight_id: "INS_FEEDBACK_LAB_01",
        user_role: role || "cfo",
        feedback_type: type,
        target_driver_id: driverId,
        notes: `Simulated calibration feedback for ${driverName}`
      });

      if (res.feedback_ack?.updated_weights) {
        setWeights(res.feedback_ack.updated_weights);
      }

      const newEntry = {
        id: `FB_${String(feedbackHistory.length + 1).padStart(4, '0')}`,
        driver: driverName,
        type: type,
        user: `${role.toUpperCase()} User`,
        notes: "Live analyst calibration applied.",
        timestamp: new Date().toLocaleTimeString(),
        effect: type === 'CORRECT_DRIVER' ? "+0.08 Boost to Evidence Factor" : "-0.12 Penalty to Stale Weight"
      };

      setFeedbackHistory([newEntry, ...feedbackHistory]);
      setToast(`Feedback registered: Dynamic ranking weights updated.`);
      setTimeout(() => setToast(null), 4000);
    } catch (err) {
      alert(`Feedback error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[11px] font-bold font-mono uppercase tracking-wider border border-slate-200">
              SECTION 23 — HUMAN FEEDBACK & CALIBRATION LOOP
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Bayesian Weight Calibration Engine
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Analyst Feedback & Adaptive Driver Calibration
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Analyst validations and corrections continuously recalibrate ranking weights, refining the system's future driver prioritization.
          </p>
        </div>

        <div className="text-right font-mono text-xs">
          <span className="text-slate-400 block text-[10px] uppercase">Logged Feedback Events</span>
          <span className="text-base font-bold text-slate-800">{feedbackHistory.length} Recorded</span>
        </div>
      </div>

      {toast && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-2.5 rounded text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span className="font-semibold">{toast}</span>
        </div>
      )}

      {/* 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Dynamic Calibrated Weights */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Dynamic Ranking Weights
            </span>
            <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
              CALIBRATED
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <div className="flex justify-between text-slate-700 mb-1">
                <span>Contribution Magnitude:</span>
                <span className="font-bold">{(weights.contribution * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded overflow-hidden">
                <div className="bg-slate-800 h-full rounded" style={{ width: `${weights.contribution * 100}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 mb-1">
                <span>Evidence Quality Weight:</span>
                <span className="font-bold">{(weights.evidence_quality * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded overflow-hidden">
                <div className="bg-slate-800 h-full rounded" style={{ width: `${weights.evidence_quality * 100}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 mb-1">
                <span>Statistical Significance:</span>
                <span className="font-bold">{(weights.statistical_strength * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded overflow-hidden">
                <div className="bg-slate-800 h-full rounded" style={{ width: `${weights.statistical_strength * 100}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 mb-1">
                <span>Controllability Weight:</span>
                <span className="font-bold">{(weights.controllability * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded overflow-hidden">
                <div className="bg-slate-800 h-full rounded" style={{ width: `${weights.controllability * 100}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 mb-1">
                <span>Source Freshness Weight:</span>
                <span className="font-bold">{(weights.freshness * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded overflow-hidden">
                <div className="bg-slate-800 h-full rounded" style={{ width: `${weights.freshness * 100}%` }}></div>
              </div>
            </div>
          </div>

          {/* Action Simulation Buttons */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Simulate Analyst Correction:
            </span>
            <button
              onClick={() => handleSimulateFeedback('inventory_shortage_north', 'North Hub Inventory Shortage', 'CORRECT_DRIVER')}
              disabled={submitting}
              className="w-full py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Validate: Upvote Inventory Driver (+Boost)</span>
            </button>
            <button
              onClick={() => handleSimulateFeedback('marketing_efficiency_east', 'East Region Marketing Tag', 'INCORRECT_DRIVER')}
              disabled={submitting}
              className="w-full py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-200 transition-colors"
            >
              <ThumbsDown className="w-3.5 h-3.5 text-red-500" />
              <span>Flag: Penalize Stale Marketing Driver (-Penalty)</span>
            </button>
          </div>
        </div>

        {/* RIGHT 2 COLUMNS: Feedback Audit History */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Analyst Feedback Audit Log
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Immutable Trace History
            </span>
          </div>

          <div className="space-y-3">
            {feedbackHistory.map((item, idx) => (
              <div key={idx} className="p-3.5 bg-slate-50 rounded border border-slate-200 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 font-mono">{item.driver}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    item.type === 'CORRECT_DRIVER' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {item.type}
                  </span>
                </div>
                <p className="text-slate-600">{item.notes}</p>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1 border-t border-slate-200">
                  <span>Author: {item.user} · {item.timestamp}</span>
                  <span className="text-emerald-700 font-bold">{item.effect}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
