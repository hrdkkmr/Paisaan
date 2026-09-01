import React from 'react';
import { 
  Home, 
  Layers, 
  Lightbulb, 
  CheckSquare, 
  GitFork, 
  MessageSquare, 
  Bell, 
  Settings, 
  Sparkles,
  ChevronRight,
  ShieldCheck,
  User,
  Sliders
} from 'lucide-react';

export default function AppShell({
  activeTab,
  setActiveTab,
  role,
  setRole,
  persona,
  setPersona,
  unreadAlertsCount = 3,
  onOpenAlerts,
  onOpenDiagnostics,
  onStartDemo
}) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'operations', label: 'Operations', icon: Layers },
    { id: 'insights', label: 'Insights', icon: Lightbulb },
    { id: 'decisions', label: 'Decisions', icon: CheckSquare },
    { id: 'scenarios', label: 'What If?', icon: GitFork },
    { id: 'ask', label: 'Ask Paisaan', icon: MessageSquare }
  ];

  const roles = [
    { id: 'cfo', label: 'CFO (Financial)' },
    { id: 'operations_manager', label: 'Operations Lead' },
    { id: 'marketing_director', label: 'Marketing Lead' }
  ];

  return (
    <div className="w-full">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-7 h-7 rounded-lg bg-teal-800 flex items-center justify-center text-white font-bold text-xs shadow-xs tracking-wider">
              P
            </div>
            <div>
              <span className="font-bold text-gray-900 tracking-tight text-base">
                Paisaan
              </span>
              <span className="text-[11px] text-gray-400 font-medium ml-2 hidden md:inline">
                Intelligence that turns business signals into decisions
              </span>
            </div>
          </div>

          {/* Header Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Interactive Tour / Demo Button */}
            <button
              onClick={onStartDemo}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold border border-teal-200 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-700" />
              <span className="hidden sm:inline">Executive Tour</span>
              <span className="sm:hidden">Tour</span>
            </button>

            {/* Persona / Role Selector */}
            <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-md px-2 py-1 text-xs">
              <User className="w-3.5 h-3.5 text-gray-500" />
              <select
                value={persona}
                onChange={(e) => {
                  setPersona(e.target.value);
                  setRole(e.target.value);
                }}
                className="bg-transparent text-gray-800 font-medium text-xs focus:outline-none cursor-pointer"
              >
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>{r.label}</option>
                ))}
              </select>
            </div>

            {/* Central Alerts Center Trigger */}
            <button
              onClick={onOpenAlerts}
              className="relative p-1.5 rounded-md hover:bg-gray-100 text-gray-600 transition-colors"
              title="View Priority Alerts"
            >
              <Bell className="w-4 h-4" />
              {unreadAlertsCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center font-mono">
                  {unreadAlertsCount}
                </span>
              )}
            </button>

            {/* Diagnostics / Settings Trigger */}
            <button
              onClick={onOpenDiagnostics}
              className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 transition-colors"
              title="System Diagnostics & Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Desktop Secondary Navigation Bar */}
        <div className="hidden md:block bg-gray-50/80 border-t border-gray-200 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center gap-1 py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-white text-gray-900 shadow-xs border border-gray-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-700' : 'text-gray-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Fixed Bottom) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg py-1 px-2 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-all ${
                isActive ? 'text-teal-800 font-bold' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-teal-700 stroke-[2.5]' : 'stroke-[1.8]'}`} />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
