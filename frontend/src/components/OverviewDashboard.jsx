import React, { useState, useEffect } from 'react';
import { 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  ChevronRight, 
  Filter,
  BarChart3,
  Layers,
  ArrowDownRight,
  ArrowUpRight,
  Lock
} from 'lucide-react';
import { getOverview } from '../api';

export default function OverviewDashboard({ role, onInvestigateKPI, onOpenPreMortem }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const regions = ['All', 'North', 'South', 'East', 'West'];
  const categories = ['All', 'Electronics', 'Apparel', 'Home & Living', 'Beauty & Wellness'];

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await getOverview(role, selectedRegion, selectedCategory);
        setData(res);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [role, selectedRegion, selectedCategory]);

  if (loading && !data) {
    return (
      <div className="p-8 text-center text-slate-500 font-mono text-xs">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-slate-700 mb-2"></div>
        <div>Reconciling multi-source streams & executing deterministic anomaly baselines...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded text-red-800 text-xs">
        <p className="font-semibold">Error Loading Executive Dashboard</p>
        <p className="mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner: Executive Materiality Alert */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded bg-red-50 border border-red-200 flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-red-700 uppercase tracking-wider bg-red-100 px-2 py-0.5 rounded">
                MATERIAL KPI ANOMALY
              </span>
              <span className="text-xs text-slate-500">
                Persistence: 7-Day Structural Deviation
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-900 mt-1">
              Gross Revenue is 11.8% below expected target (₹3.2 Cr variance) driven by North Distribution Hub supply constraints.
            </p>
            <p className="text-xs text-slate-600 mt-0.5">
              Deterministic price-volume analysis isolates 14 high-AOV SKU stockouts as the primary driver.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onInvestigateKPI('revenue')}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3.5 py-2 rounded transition-colors shadow-xs"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Investigate Drivers</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onOpenPreMortem}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-3 py-2 rounded border border-slate-300 transition-colors"
          >
            <span>Pre-Mortem Radar</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 p-3 rounded-md border border-slate-200 text-xs">
        <div className="flex items-center gap-3">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <span className="font-semibold text-slate-700">Cube Slicing:</span>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Region:</span>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-white border border-slate-200 rounded px-2 py-1 text-slate-800 font-medium focus:outline-none"
            >
              {regions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white border border-slate-200 rounded px-2 py-1 text-slate-800 font-medium focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4 text-slate-500 text-[11px] font-mono">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Sales: 190k records (30m lag)
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> WMS: 7.2k snapshots (4.5h lag)
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-500" /> Ad Pixel: 26.5h lag
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.kpis.map((kpi) => {
          if (!kpi.access_granted) {
            return (
              <div 
                key={kpi.kpi_id} 
                className="bg-slate-50 border border-slate-200 rounded-lg p-5 flex flex-col justify-between opacity-80"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{kpi.name}</span>
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-200 text-slate-600 text-[11px] font-mono font-bold">
                      <Lock className="w-3 h-3" /> RESTRICTED
                    </span>
                  </div>
                  <div className="mt-4 text-slate-400 font-mono text-sm">
                    [CONFIDENTIAL FINANCIAL METRIC]
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    {kpi.masked_reason}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-400 font-mono">
                  RBAC Policy: CFO / Executive Only
                </div>
              </div>
            );
          }

          const isNegative = kpi.pct_change < 0;
          const isHighRisk = kpi.materiality?.materiality_level === 'HIGH_MATERIALITY';

          return (
            <div
              key={kpi.kpi_id}
              onClick={() => onInvestigateKPI(kpi.kpi_id)}
              className="bg-white border border-slate-200 hover:border-slate-400 rounded-lg p-5 shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      {kpi.short_name || kpi.name}
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-bold text-slate-900 tracking-tight font-mono">
                        {kpi.kpi_id === 'revenue' ? `₹${(kpi.actual_value / 10000000).toFixed(2)} Cr` :
                         kpi.kpi_id === 'profit_margin' ? `${kpi.actual_value.toFixed(1)}%` :
                         kpi.kpi_id === 'order_volume' ? `${kpi.actual_value.toLocaleString()} orders` :
                         kpi.kpi_id === 'conversion_rate' ? `${kpi.actual_value.toFixed(2)}%` :
                         `${kpi.actual_value.toFixed(1)}%`}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        exp: {kpi.kpi_id === 'revenue' ? `₹${(kpi.expected_value / 10000000).toFixed(2)} Cr` :
                              kpi.kpi_id === 'profit_margin' ? `${kpi.expected_value.toFixed(1)}%` :
                              kpi.kpi_id === 'order_volume' ? `${kpi.expected_value.toLocaleString()}` :
                              `${kpi.expected_value.toFixed(1)}%`}
                      </span>
                    </div>
                  </div>

                  {/* Materiality Badge */}
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                    isHighRisk 
                      ? 'bg-red-50 text-red-700 border border-red-200' 
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {kpi.materiality?.badge || 'NORMAL'}
                  </span>
                </div>

                {/* Percentage Deviation & Z-Score */}
                <div className="mt-3 flex items-center gap-3">
                  <div className={`flex items-center gap-1 font-mono font-semibold text-xs ${
                    isNegative ? 'text-red-600' : 'text-emerald-600'
                  }`}>
                    {isNegative ? <ArrowDownRight className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                    <span>{kpi.pct_change > 0 ? `+${kpi.pct_change}%` : `${kpi.pct_change}%`}</span>
                  </div>

                  <span className="text-slate-300">|</span>

                  <span className="text-xs text-slate-500 font-mono">
                    z = {kpi.z_score > 0 ? `+${kpi.z_score}` : kpi.z_score}σ
                  </span>

                  <span className="text-slate-300">|</span>

                  <span className="text-xs text-slate-500">
                    {kpi.persistence_days}d sustained
                  </span>
                </div>

                {/* Mini SVG Trend Sparkline */}
                {kpi.trend_series && kpi.trend_series.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
                      <span>14-day EWMA Baseline</span>
                      <span>Latest Deviation</span>
                    </div>
                    <svg className="w-full h-10 overflow-visible" viewBox="0 0 200 40">
                      {/* Expected Baseline Line (dashed grey) */}
                      <polyline
                        fill="none"
                        stroke="#cbd5e1"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                        points={kpi.trend_series.map((pt, idx) => {
                          const x = (idx / (kpi.trend_series.length - 1)) * 200;
                          const minV = Math.min(...kpi.trend_series.map(p => Math.min(p.actual, p.expected)));
                          const maxV = Math.max(...kpi.trend_series.map(p => Math.max(p.actual, p.expected)));
                          const range = maxV - minV || 1;
                          const y = 35 - ((pt.expected - minV) / range) * 30;
                          return `${x},${y}`;
                        }).join(' ')}
                      />
                      {/* Actual Trend Line */}
                      <polyline
                        fill="none"
                        stroke={isNegative ? '#dc2626' : '#10b981'}
                        strokeWidth="2"
                        points={kpi.trend_series.map((pt, idx) => {
                          const x = (idx / (kpi.trend_series.length - 1)) * 200;
                          const minV = Math.min(...kpi.trend_series.map(p => Math.min(p.actual, p.expected)));
                          const maxV = Math.max(...kpi.trend_series.map(p => Math.max(p.actual, p.expected)));
                          const range = maxV - minV || 1;
                          const y = 35 - ((pt.actual - minV) / range) * 30;
                          return `${x},${y}`;
                        }).join(' ')}
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Card Footer: Confidence & Action Trigger */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-600 font-mono text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
                  <span>Conf: {kpi.confidence?.score || 86}%</span>
                  <span className="text-slate-400">({kpi.confidence?.level || 'HIGH'})</span>
                </div>

                <span className="text-slate-800 font-semibold group-hover:text-slate-950 flex items-center gap-0.5 text-xs">
                  Why did it change? <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
