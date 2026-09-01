import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  ChevronRight, 
  ArrowRight,
  ArrowDownRight,
  Layers,
  Sparkles,
  ArrowUpRight,
  CheckSquare
} from 'lucide-react';
import { getOverview } from '../api';

export default function HomeOverview({
  role = 'cfo',
  onInvestigateSignal,
  onReviewDecision,
  onOpenOperations,
  onOpenScenarios
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await getOverview(role, 'All', 'All');
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [role]);

  if (loading && !data) {
    return (
      <div className="p-12 text-center text-gray-500 font-sans text-xs">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-teal-700 border-t-transparent mb-2"></div>
        <div>Synthesizing business signals & running deterministic baselines...</div>
      </div>
    );
  }

  const kpis = data?.kpis || [];

  return (
    <div className="space-y-5 pb-20 md:pb-6">
      
      {/* 1. OVERALL BUSINESS HEALTH SCORE */}
      <div className="paisaan-card p-5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Business Health
          </span>
          <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            <TrendingUp className="w-3 h-3" />
            <span>↑ 4.2% vs previous period</span>
          </span>
        </div>

        <div className="mt-3 flex items-baseline gap-3">
          <span className="text-4xl font-extrabold text-gray-900 tracking-tight font-mono">
            82
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-800">
              Healthy Overall
            </span>
            <span className="text-xs text-gray-500">
              1 Priority Signal requiring management attention
            </span>
          </div>
        </div>
      </div>

      {/* 2. PRIORITY SIGNAL (LEVEL 1 ATTENTION) */}
      <div className="paisaan-card border-l-4 border-l-red-600 p-5 bg-gradient-to-r from-red-50/40 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-red-800">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span>Priority Signal</span>
          </div>
          <span className="text-xs font-mono font-bold text-gray-700 bg-white px-2 py-0.5 rounded border border-gray-200 shadow-2xs">
            Confidence: 95%
          </span>
        </div>

        <h3 className="text-base font-bold text-gray-900 mt-2 leading-snug">
          Revenue is 11.8% below expected performance.
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3 pt-3 border-t border-gray-100 text-xs">
          <div>
            <span className="text-[10px] text-gray-400 uppercase font-medium block">Primary Driver</span>
            <span className="font-semibold text-gray-900">North Distribution Hub</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 uppercase font-medium block">Financial Impact</span>
            <span className="font-bold text-red-700 font-mono">₹3.2 Cr variance</span>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="text-[10px] text-gray-400 uppercase font-medium block">Root Constraint</span>
            <span className="font-medium text-gray-700">14 High-Value SKUs Stockout</span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={() => onInvestigateSignal('revenue')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <span>Investigate Signal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onReviewDecision}
            className="text-xs font-semibold text-teal-800 hover:text-teal-950 px-2.5 py-1.5 rounded hover:bg-teal-50 transition-colors"
          >
            View Recommended Decision →
          </button>
        </div>
      </div>

      {/* 3. KEY EXECUTIVE METRICS */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Key Executive Metrics
          </h4>
          <span className="text-[11px] text-gray-400 font-mono">Governed Baseline</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {kpis.map((kpi) => {
            if (!kpi.access_granted) return null;
            const isNegative = kpi.pct_change < 0;

            return (
              <div
                key={kpi.kpi_id}
                onClick={() => onInvestigateSignal(kpi.kpi_id)}
                className="paisaan-card p-4 hover:border-gray-300 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span className="font-medium">{kpi.short_name || kpi.name}</span>
                    <span className="text-[10px] font-mono font-medium text-gray-400">
                      exp: {kpi.kpi_id === 'revenue' ? `₹${(kpi.expected_value / 10000000).toFixed(2)} Cr` :
                            kpi.kpi_id === 'profit_margin' ? `${kpi.expected_value.toFixed(1)}%` :
                            kpi.kpi_id === 'order_volume' ? `${kpi.expected_value.toLocaleString()}` :
                            `${kpi.expected_value.toFixed(1)}%`}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-xl font-bold text-gray-900 font-mono">
                      {kpi.kpi_id === 'revenue' ? `₹${(kpi.actual_value / 10000000).toFixed(2)} Cr` :
                       kpi.kpi_id === 'profit_margin' ? `${kpi.actual_value.toFixed(1)}%` :
                       kpi.kpi_id === 'order_volume' ? `${kpi.actual_value.toLocaleString()}` :
                       kpi.kpi_id === 'conversion_rate' ? `${kpi.actual_value.toFixed(2)}%` :
                       `${kpi.actual_value.toFixed(1)}%`}
                    </span>

                    <span className={`flex items-center text-xs font-bold font-mono ${
                      isNegative ? 'text-red-700' : 'text-emerald-700'
                    }`}>
                      {isNegative ? <ArrowDownRight className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                      <span>{kpi.pct_change > 0 ? `+${kpi.pct_change}%` : `${kpi.pct_change}%`}</span>
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-teal-700" />
                    <span>Conf: {kpi.confidence?.score || 86}%</span>
                  </span>
                  <span className="text-gray-600 font-medium group-hover:text-gray-900">
                    Details →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. WHAT CHANGED? (CHRONOLOGICAL CAUSAL SEQUENCE) */}
      <div className="paisaan-card p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            What Changed? (Causal Chain)
          </span>
          <span className="text-[11px] text-gray-400 font-mono">Last 7 Days</span>
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
              1
            </span>
            <div>
              <p className="font-semibold text-gray-900">Inbound Distribution Constraint Increased</p>
              <p className="text-gray-500 text-[11px]">Port congestion extended lead time from 3.2 days to 7.8 days for North DC inbound shipments.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
              2
            </span>
            <div>
              <p className="font-semibold text-gray-900">14 High-Value SKUs Stocked Out</p>
              <p className="text-gray-500 text-[11px]">North Hub availability dropped from 94% to 71% in top-selling Electronics categories.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
              3
            </span>
            <div>
              <p className="font-semibold text-gray-900">Orders Declined 64% in North Region</p>
              <p className="text-gray-500 text-[11px]">Unfulfilled demand translated directly into lost customer order conversions.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <span className="w-5 h-5 rounded-full bg-red-100 text-red-800 font-bold flex items-center justify-center shrink-0 text-[11px]">
              4
            </span>
            <div>
              <p className="font-semibold text-red-900">Revenue Impact Reached ₹3.2 Cr</p>
              <p className="text-gray-500 text-[11px]">Material divergence confirmed against 14-day seasonal baseline model.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. TODAY'S RECOMMENDED DECISION */}
      <div className="paisaan-card bg-gradient-to-br from-teal-900 to-gray-900 text-white p-5 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-teal-300 uppercase tracking-wider text-[10px]">
            Today's Recommended Decision
          </span>
          <span className="bg-teal-800/80 text-teal-100 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
            Confidence: 89%
          </span>
        </div>

        <h3 className="text-base font-bold text-white leading-snug">
          Reallocate Inventory: Central West Hub → North Hub
        </h3>

        <p className="text-xs text-gray-300 leading-relaxed">
          West Central Hub has surplus stock cover (140% SLA). Express inter-DC line-haul transfer will restore North Hub on-shelf fulfillment to ≥92% within 72 hours.
        </p>

        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-teal-800/60 text-xs">
          <div>
            <span className="text-[10px] text-gray-400 block uppercase">Expected Protected Revenue</span>
            <span className="font-bold text-teal-300 font-mono text-sm">₹1.4 Cr – ₹1.9 Cr</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 block uppercase">Execution Risk</span>
            <span className="font-bold text-gray-200">Low (Inter-company transfer)</span>
          </div>
        </div>

        <div className="pt-2 flex items-center gap-3">
          <button
            onClick={onReviewDecision}
            className="w-full sm:w-auto px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Review & Approve Decision</span>
          </button>
          <button
            onClick={onOpenScenarios}
            className="w-full sm:w-auto px-3.5 py-2 bg-white/10 hover:bg-white/20 text-gray-200 font-medium rounded-lg text-xs transition-colors"
          >
            Simulate "What If?" First
          </button>
        </div>
      </div>

    </div>
  );
}
