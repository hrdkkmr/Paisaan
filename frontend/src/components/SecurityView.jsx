import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  XCircle, 
  UserCheck, 
  FileText 
} from 'lucide-react';

export default function SecurityView({ currentRole, onSwitchRole }) {
  const [selectedRole, setSelectedRole] = useState(currentRole || 'cfo');

  const roleSpecs = {
    cfo: {
      title: "Chief Financial Officer (CFO)",
      accessible_kpis: ["Gross Realized Revenue", "Operating Profit Margin", "Order Volume", "CAC", "ROAS", "Inventory Availability"],
      permitted_fields: ["revenue", "profit", "cost", "profit_margin_pct", "discount_pct", "unit_price", "campaign_spend", "attributed_revenue"],
      restricted_fields: [],
      sample_query_response: "Gross revenue registered at ₹4.82 Cr (-11.8% variance). Gross Profit is ₹1.45 Cr with operating margin at 30.1%."
    },
    operations_manager: {
      title: "Operations & Logistics Manager",
      accessible_kpis: ["Inventory Availability", "Order Volume", "Conversion Rate"],
      permitted_fields: ["available_units", "demand_units", "stockout_flag", "replenishment_delay_days", "quantity", "orders", "warehouse_id"],
      restricted_fields: ["profit", "cost", "profit_margin_pct", "campaign_spend", "attributed_revenue"],
      sample_query_response: "North Hub availability fell to 71% with 14 high-volume SKUs stocked out. [CONFIDENTIAL FINANCIAL MARGIN MASKED BY POLICY]."
    },
    marketing_director: {
      title: "Director of Performance Marketing",
      accessible_kpis: ["Conversion Rate", "CAC", "ROAS", "Order Volume"],
      permitted_fields: ["campaign_spend", "impressions", "clicks", "conversions", "attributed_revenue", "roas", "cac", "channel"],
      restricted_fields: ["cost", "profit", "profit_margin_pct", "replenishment_delay_days", "warehouse_id"],
      sample_query_response: "Campaign ROAS is 3.1x with CAC at ₹1,240. [INTERNAL WAREHOUSE COGS & PROFIT MASKED BY POLICY]."
    },
    sales_lead: {
      title: "Regional Sales Lead",
      accessible_kpis: ["Order Volume", "Conversion Rate"],
      permitted_fields: ["orders", "quantity", "channel", "region", "discount_pct"],
      restricted_fields: ["cost", "profit", "profit_margin_pct", "campaign_spend"],
      sample_query_response: "North Region completed 12,400 orders across web and app channels."
    }
  };

  const currentSpec = roleSpecs[selectedRole] || roleSpecs.cfo;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[11px] font-bold font-mono uppercase tracking-wider border border-slate-200">
              SCENARIO 5 — ROLE-BASED ACCESS CONTROL & SECURITY GATE
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Enforcement: Pre-Retrieval Semantic Gate
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Governed RBAC & Pre-Retrieval Field Masking Console
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Security policies and field masking are strictly executed BEFORE context retrieval and LLM context construction, preventing data exfiltration.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {Object.keys(roleSpecs).map((r) => (
            <button
              key={r}
              onClick={() => {
                setSelectedRole(r);
                onSwitchRole(r);
              }}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                selectedRole === r
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Role Permission Audit Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Permitted KPIs */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold uppercase tracking-wider text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Permitted Governed KPIs</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-700 font-mono">
            {currentSpec.accessible_kpis.map((kpi, i) => (
              <li key={i} className="flex items-center gap-2 p-2 bg-slate-50 rounded border border-slate-100">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>{kpi}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Permitted Fields vs Masked Fields */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
          <div>
            <div className="flex items-center gap-2 text-slate-900 font-bold uppercase tracking-wider text-xs mb-2">
              <Eye className="w-4 h-4 text-slate-700" />
              <span>Permitted Context Fields</span>
            </div>
            <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
              {currentSpec.permitted_fields.map((f, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                  {f}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-red-700 font-bold uppercase tracking-wider text-xs mb-2">
              <EyeOff className="w-4 h-4 text-red-600" />
              <span>Masked Restricted Fields</span>
            </div>
            {currentSpec.restricted_fields.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                {currentSpec.restricted_fields.map((rf, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 font-bold">
                    [MASKED] {rf}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-xs text-slate-500 italic">No fields restricted (Full Executive Access)</span>
            )}
          </div>
        </div>

        {/* Live LLM Response Preview Under Active Role */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold uppercase tracking-wider text-xs">
            <Lock className="w-4 h-4 text-slate-700" />
            <span>Pre-Retrieval LLM Context Filter</span>
          </div>
          <p className="text-xs text-slate-500">
            Simulated response to prompt: <span className="font-mono text-slate-700">"Explain the revenue and gross margin variance."</span>
          </p>
          <div className="p-3.5 bg-slate-900 text-slate-100 rounded-md font-mono text-xs leading-relaxed">
            {currentSpec.sample_query_response}
          </div>
          <div className="text-[10px] text-slate-400 font-mono text-right">
            Policy Gate: PERMIT_WITH_MASKING
          </div>
        </div>

      </div>
    </div>
  );
}
