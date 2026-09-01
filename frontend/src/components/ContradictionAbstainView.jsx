import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Sliders, 
  HelpCircle,
  Cpu
} from 'lucide-react';
import { investigateKPI } from '../api';

export default function ContradictionAbstainView({ role, persona, onOpenEvidence }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await investigateKPI('revenue', role, persona, 'marketing_conflict');
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
        <div>Auditing multi-source telemetry & detecting contradictory signals...</div>
      </div>
    );
  }

  const { what_changed, confidence, abstention, contradictions, persona_narrative } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[11px] font-bold font-mono uppercase tracking-wider">
              SCENARIO 2 — CONTRADICTORY EVIDENCE & ABSTENTION
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Confidence: {confidence.score}% (LOW)
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Explicit Analytical Abstention Showcase
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Demonstrating how the engine detects conflicting data between Ad Platforms and Sales Ledgers, explicitly saying "I don't know" rather than fabricating a cause.
          </p>
        </div>

        <div className="px-3.5 py-2 rounded-md bg-amber-50 border border-amber-300 text-amber-900 font-mono text-xs font-bold">
          DECISION: EXPLICIT ABSTENTION
        </div>
      </div>

      {/* Side-by-Side Conflict Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Source A: Ad Platform Pixel */}
        <div className="bg-white border border-amber-200 rounded-lg p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>Source A: Third-Party Marketing Pixel (East Region)</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-50 text-amber-700 border border-amber-200 font-bold">
              STALE (26.5h lag)
            </span>
          </div>

          <div className="p-3 bg-amber-50/50 rounded border border-amber-100 space-y-1 font-mono text-xs text-amber-900">
            <div><span className="text-slate-500">Claimed CTR: </span><span className="font-bold">+18.4% Lift</span></div>
            <div><span className="text-slate-500">Attributed Revenue: </span><span className="font-bold">₹1.42 Cr Reported</span></div>
            <div><span className="text-slate-500">Platform Status: </span><span>Double-firing pixel sync error</span></div>
          </div>

          <p className="text-xs text-slate-600">
            Ad platform optimization algorithms report high campaign efficiency and advocate increasing ad budget.
          </p>
        </div>

        {/* Source B: Direct Transaction Ledger */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Source B: Verified Transactional Sales Ledger</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
              VERIFIED (30m lag)
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1 font-mono text-xs text-slate-900">
            <div><span className="text-slate-500">Verified Conversion: </span><span className="font-bold text-red-600">-42.1% Collapse</span></div>
            <div><span className="text-slate-500">Completed Orders: </span><span className="font-bold">3,120 (vs Expected 5,400)</span></div>
            <div><span className="text-slate-500">Ledger Integrity: </span><span>100% Cryptographically Verified</span></div>
          </div>

          <p className="text-xs text-slate-600">
            Transactional ground-truth records a sharp checkout conversion collapse in the same regional window.
          </p>
        </div>
      </div>

      {/* SYSTEM ABSTENTION AUDIT BOX */}
      <div className="bg-slate-900 text-white rounded-lg p-6 space-y-4 shadow-lg">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
              Deterministic Decision Audit
            </span>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Confidence Threshold: 50.0% · Calculated: {confidence.score}%
          </span>
        </div>

        <div>
          <h3 className="text-base font-bold text-white font-mono">
            "I do not possess sufficient non-contradictory evidence to isolate a primary driver."
          </h3>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            {persona_narrative.narrative}
          </p>
        </div>

        <div className="p-3.5 bg-slate-800/80 rounded border border-slate-700 text-xs space-y-2">
          <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px] block">
            Governed Actions Enforced Under Abstention:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] font-mono text-slate-300">
            <div className="flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5 text-red-400" />
              <span>Recommendations Suppressed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pixel Sync Ticket Dispatched</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Ledger Isolated</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
