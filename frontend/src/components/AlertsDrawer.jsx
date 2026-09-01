import React from 'react';
import { 
  X, 
  Bell, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export default function AlertsDrawer({ onClose, onSelectAlert }) {
  const alerts = [
    {
      id: "ALT_01",
      severity: "CRITICAL",
      title: "Gross Revenue Variance (-11.8%)",
      summary: "North Distribution Hub stockout on 14 high-AOV SKUs creating a ₹3.2 Cr revenue gap.",
      timestamp: "30m ago",
      targetTab: "insights",
      targetKpi: "revenue"
    },
    {
      id: "ALT_02",
      severity: "ATTENTION",
      title: "Inbound Port Transit Delay (+4.8 Days)",
      summary: "Sea freight container congestion threatening 9-day stock depletion in North & West Hubs.",
      timestamp: "2h ago",
      targetTab: "operations"
    },
    {
      id: "ALT_03",
      severity: "ATTENTION",
      title: "East Region Ad Pixel Sync Lag (26.5h)",
      summary: "Telemetry divergence between marketing pixel and verified sales ledger. Ad decisions suppressed.",
      timestamp: "4h ago",
      targetTab: "insights"
    },
    {
      id: "ALT_04",
      severity: "RESOLVED",
      title: "West Central Warehouse Inventory Rebalancing",
      summary: "Surplus stock cover reached 140% SLA target; ready for inter-DC transfer.",
      timestamp: "6h ago",
      targetTab: "operations"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-gray-900/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-gray-200">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-gray-700" />
            <h3 className="text-sm font-bold text-gray-900">
              Notification & Alert Center
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-gray-400 hover:text-gray-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Alerts List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 text-xs">
          {alerts.map((alt) => {
            const isCrit = alt.severity === 'CRITICAL';
            const isAttn = alt.severity === 'ATTENTION';
            const isRes = alt.severity === 'RESOLVED';

            return (
              <div
                key={alt.id}
                onClick={() => {
                  onSelectAlert(alt.targetTab);
                  onClose();
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer hover:shadow-xs ${
                  isCrit ? 'bg-red-50/40 border-red-200 hover:border-red-300' :
                  isAttn ? 'bg-amber-50/40 border-amber-200 hover:border-amber-300' :
                  'bg-emerald-50/40 border-emerald-200 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                    isCrit ? 'bg-red-100 text-red-800' :
                    isAttn ? 'bg-amber-100 text-amber-800' :
                    'bg-emerald-100 text-emerald-800'
                  }`}>
                    {alt.severity}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">{alt.timestamp}</span>
                </div>

                <h4 className="font-bold text-gray-900 text-xs">
                  {alt.title}
                </h4>

                <p className="text-gray-600 text-[11px] mt-1 leading-relaxed">
                  {alt.summary}
                </p>

                <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] font-semibold text-teal-800">
                  <span>Take action →</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-lg"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
