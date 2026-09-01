import React from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Sliders, 
  Layers, 
  HelpCircle, 
  Sparkles,
  Lock,
  UserCheck,
  Zap,
  Terminal,
  Database
} from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  role,
  setRole,
  persona,
  setPersona,
  activeScenario,
  onSelectScenario,
  telemetry,
  onOpenTelemetry,
  onStartTour
}) {
  const roles = [
    { id: 'cfo', label: 'CFO / Executive' },
    { id: 'operations_manager', label: 'Operations Lead' },
    { id: 'marketing_director', label: 'Marketing Director' },
    { id: 'sales_lead', label: 'Sales Lead' }
  ];

  const personas = [
    { id: 'cfo', label: 'CFO (Financial Focus)' },
    { id: 'operations_manager', label: 'Operations (Logistics Focus)' },
    { id: 'marketing_director', label: 'Marketing (Growth Focus)' }
  ];

  const scenarios = [
    { id: 'scenario-1-strong-evidence', label: 'Scenario 1: Strong Evidence (North Stockout)' },
    { id: 'scenario-2-contradictory-evidence', label: 'Scenario 2: Contradictory Evidence & Abstain' },
    { id: 'scenario-3-sparse-history', label: 'Scenario 3: Sparse History (SmartPhone X - 17d)' },
    { id: 'scenario-4-persona-difference', label: 'Scenario 4: Persona Contrast (CFO vs Ops)' },
    { id: 'scenario-5-security-rbac', label: 'Scenario 5: Security & RBAC Masking' },
    { id: 'scenario-6-financial-pre-mortem', label: 'Scenario 6: Financial Pre-Mortem Radar' }
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      {/* Top Meta Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-slate-900 flex items-center justify-center text-white font-bold text-xs tracking-wider">
              BI
            </div>
            <span className="font-semibold text-slate-900 tracking-tight text-sm">
              BusinessIntelligence.ai
            </span>
          </div>
          <span className="text-slate-300">|</span>
          <span className="text-slate-600 font-medium hidden sm:inline">
            Evidence-Grounded Intelligence-to-Action Engine
          </span>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-mono font-medium border border-slate-200">
            PROD TRACK 3
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Preset Scenario Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded border border-slate-200">
            <Sparkles className="w-3.5 h-3.5 text-slate-700" />
            <label htmlFor="scenario-select" className="text-slate-500 font-medium">Scenario:</label>
            <select
              id="scenario-select"
              value={activeScenario}
              onChange={(e) => onSelectScenario(e.target.value)}
              className="bg-transparent font-medium text-slate-800 focus:outline-none cursor-pointer"
            >
              {scenarios.map((sc) => (
                <option key={sc.id} value={sc.id}>
                  {sc.label}
                </option>
              ))}
            </select>
          </div>

          {/* Interactive Guided Tour */}
          <button
            onClick={onStartTour}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-2.5 py-1 rounded font-medium shadow-xs transition-colors"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Demo Tour</span>
          </button>

          {/* Telemetry Pill */}
          <button
            onClick={onOpenTelemetry}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 px-2.5 py-1 rounded border border-slate-200 font-mono text-slate-700 transition-colors"
            title="Click to view full execution telemetry and cost breakdown"
          >
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            <span>{telemetry?.total_latency_ms || 48.2}ms</span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-500">{telemetry?.cost_display || '$0.00018'}</span>
            <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[10px] font-bold">
              {telemetry?.cache_status || 'MISS'}
            </span>
          </button>
        </div>
      </div>

      {/* Main Navigation & Role/Persona Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-3">
        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto py-1">
          {[
            { id: 'overview', label: 'Executive Overview', icon: Activity },
            { id: 'investigation', label: 'KPI Deep Dive & Actions', icon: Layers },
            { id: 'pre-mortem', label: 'Financial Pre-Mortem', icon: ShieldAlert },
            { id: 'contradictions', label: 'Contradiction & Abstain', icon: Sliders },
            { id: 'sparse-history', label: 'Sparse History (New SKU)', icon: Database },
            { id: 'security', label: 'Security & RBAC', icon: Lock },
            { id: 'feedback', label: 'Feedback Calibration', icon: UserCheck },
            { id: 'nl-query', label: 'NL Console', icon: Terminal }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Persona & RBAC Role Toggles */}
        <div className="flex items-center gap-2">
          {/* Persona Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded border border-slate-200 text-xs">
            <span className="text-slate-500 font-medium">Persona:</span>
            <select
              value={persona}
              onChange={(e) => setPersona(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              {personas.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* Role / RBAC Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded border border-slate-200 text-xs">
            <Lock className="w-3 h-3 text-slate-500" />
            <span className="text-slate-500 font-medium">Role:</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}
