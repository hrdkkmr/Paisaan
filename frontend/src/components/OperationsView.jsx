import React, { useState } from 'react';
import { 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Truck, 
  ArrowRight, 
  RefreshCw, 
  TrendingDown, 
  BarChart2,
  Box,
  MapPin
} from 'lucide-react';

export default function OperationsView({ onInitiateRebalance, onInvestigateDriver }) {
  const [activeSegment, setActiveSegment] = useState('hubs'); // 'hubs', 'bottlenecks', 'skus'

  const hubs = [
    {
      id: "WH_NORTH_01",
      name: "North Regional Distribution Hub (Delhi-NCR)",
      availability_pct: 71.4,
      status: "CRITICAL_STOCKOUT",
      stock_cover_days: 5.2,
      target_sla_days: 14.0,
      lead_time_delay: "+4.8 Days",
      revenue_at_risk: "₹3.2 Cr",
      bottleneck: "Inbound Port Transit Congestion"
    },
    {
      id: "WH_WEST_01",
      name: "West Central Warehouse (Mumbai Hub)",
      availability_pct: 98.2,
      status: "SURPLUS_COVER",
      stock_cover_days: 19.5,
      target_sla_days: 14.0,
      lead_time_delay: "Normal (0.2d)",
      revenue_at_risk: "₹0.0 Cr",
      bottleneck: "None (Surplus available for transfer)"
    },
    {
      id: "WH_SOUTH_01",
      name: "South Distribution Center (Bengaluru)",
      availability_pct: 88.5,
      status: "MONITORING",
      stock_cover_days: 9.8,
      target_sla_days: 14.0,
      lead_time_delay: "+1.2 Days",
      revenue_at_risk: "₹0.6 Cr",
      bottleneck: "Competitor price discounting pressure"
    },
    {
      id: "WH_EAST_01",
      name: "East Logistics Node (Kolkata)",
      availability_pct: 91.0,
      status: "NORMAL",
      stock_cover_days: 12.4,
      target_sla_days: 14.0,
      lead_time_delay: "Normal",
      revenue_at_risk: "₹0.3 Cr",
      bottleneck: "Pixel attribution lag (26.5h)"
    }
  ];

  const criticalSkus = [
    { sku: "PROD_LAPTOP_PRO", name: "Laptop Pro Max 15", category: "Electronics", price: "₹85,000", deficit_units: 320, loss_inr: "₹1.45 Cr", hub: "North Hub" },
    { sku: "PROD_HEADPHONES_ANC", name: "ANC Studio Headphones", category: "Electronics", price: "₹12,000", deficit_units: 840, loss_inr: "₹0.92 Cr", hub: "North Hub" },
    { sku: "PROD_SMART_WATCH", name: "Smart Fitness Watch Ultra", category: "Electronics", price: "₹18,000", deficit_units: 410, loss_inr: "₹0.68 Cr", hub: "North Hub" }
  ];

  return (
    <div className="space-y-5 pb-20 md:pb-6">
      
      {/* Header */}
      <div className="paisaan-card p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Operations Center
          </span>
          <h2 className="text-lg font-bold text-gray-900 mt-1">
            Regional Hub Logistics & Stockout Controls
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time WMS telemetry, inventory coverage, and inter-facility transfer orchestration.
          </p>
        </div>

        {/* Segmented Controls */}
        <div className="flex items-center bg-gray-100 p-1 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setActiveSegment('hubs')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeSegment === 'hubs' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Regional Hubs
          </button>
          <button
            onClick={() => setActiveSegment('bottlenecks')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeSegment === 'bottlenecks' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Bottlenecks
          </button>
          <button
            onClick={() => setActiveSegment('skus')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeSegment === 'skus' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            14 Stocked-Out SKUs
          </button>
        </div>
      </div>

      {/* SEGMENT 1: REGIONAL HUBS */}
      {activeSegment === 'hubs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hubs.map((h) => {
            const isCritical = h.status === 'CRITICAL_STOCKOUT';
            const isSurplus = h.status === 'SURPLUS_COVER';

            return (
              <div 
                key={h.id} 
                className={`paisaan-card p-5 flex flex-col justify-between ${
                  isCritical ? 'border-red-200 bg-red-50/20' : ''
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500 shrink-0" />
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">{h.name}</h4>
                        <span className="text-[10px] text-gray-400 font-mono">{h.id}</span>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      isCritical ? 'bg-red-100 text-red-800' :
                      isSurplus ? 'bg-emerald-100 text-emerald-800' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {h.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-gray-100 text-xs">
                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase">Availability</span>
                      <span className={`font-mono font-bold text-sm ${isCritical ? 'text-red-700' : 'text-gray-900'}`}>
                        {h.availability_pct}%
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase">Stock Cover</span>
                      <span className="font-mono font-bold text-gray-800 text-sm">
                        {h.stock_cover_days}d <span className="text-[10px] font-normal text-gray-400">/ 14d</span>
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase">Transit Delay</span>
                      <span className={`font-mono font-bold text-sm ${isCritical ? 'text-red-700' : 'text-gray-700'}`}>
                        {h.lead_time_delay}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 p-2.5 bg-gray-50 rounded-lg text-xs">
                    <span className="font-semibold text-gray-700">Root Constraint: </span>
                    <span className="text-gray-600">{h.bottleneck}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  {isCritical ? (
                    <button
                      onClick={onInitiateRebalance}
                      className="w-full py-2 bg-teal-800 hover:bg-teal-700 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Rebalance Stock from West Hub</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-gray-400 font-mono">
                      Telemetry synced 4.5h ago
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SEGMENT 2: BOTTLENECK ANALYSIS */}
      {activeSegment === 'bottlenecks' && (
        <div className="paisaan-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Identified Supply Chain Bottlenecks
            </span>
            <span className="text-xs text-red-700 font-bold font-mono">1 Critical Alert</span>
          </div>

          <div className="p-4 rounded-lg bg-red-50/50 border border-red-200 space-y-2">
            <div className="flex items-center gap-2 text-red-800 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>Inbound Port Congestion (North Distribution Hub)</span>
            </div>
            <p className="text-xs text-gray-700 leading-relaxed">
              Sea port container dwell time increased from 3.2 days to 7.8 days for tier-1 semiconductor and electronics components.
              This has depleted North Hub safety stock cover down to 5.2 days (SLA: 14 days), triggering stockouts on 14 top-selling SKUs.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={onInitiateRebalance}
                className="px-3.5 py-1.5 bg-gray-900 hover:bg-gray-800 text-white rounded-md text-xs font-semibold transition-colors"
              >
                Review Inter-DC Line-Haul Transfer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SEGMENT 3: 14 STOCKED-OUT SKUs */}
      {activeSegment === 'skus' && (
        <div className="paisaan-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Critical Affected SKUs (Top 3 of 14)
              </span>
              <p className="text-xs text-gray-400 mt-0.5">High-ticket items driving 84% of revenue variance</p>
            </div>
            <span className="text-xs font-mono font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded border border-red-200">
              Total Lost GMV: ₹3.05 Cr
            </span>
          </div>

          <div className="space-y-3">
            {criticalSkus.map((item) => (
              <div key={item.sku} className="p-3.5 bg-gray-50 rounded-lg border border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-gray-900">{item.name}</div>
                  <div className="text-[11px] text-gray-400 font-mono">{item.sku} · Price: {item.price}</div>
                </div>

                <div className="flex items-center gap-6 text-right">
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase">Unfulfilled Deficit</span>
                    <span className="font-bold text-red-700 font-mono">{item.deficit_units} units</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase">Variance Contribution</span>
                    <span className="font-bold text-gray-900 font-mono">{item.loss_inr}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
