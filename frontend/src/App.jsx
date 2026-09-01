import React, { useState, useEffect } from 'react';
import AppShell from './components/AppShell';
import HomeOverview from './components/HomeOverview';
import OperationsView from './components/OperationsView';
import InsightsView from './components/InsightsView';
import DecisionCenter from './components/DecisionCenter';
import ScenarioSimulation from './components/ScenarioSimulation';
import AskPaisaan from './components/AskPaisaan';
import AlertsDrawer from './components/AlertsDrawer';
import SettingsDiagnostics from './components/SettingsDiagnostics';
import EvidenceDrawer from './components/EvidenceDrawer';
import DemoTourGuide from './components/DemoTourGuide';
import { investigateKPI } from './api';

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'operations', 'insights', 'decisions', 'scenarios', 'ask'
  const [role, setRole] = useState('cfo');
  const [persona, setPersona] = useState('cfo');

  const [investigationData, setInvestigationData] = useState(null);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);
  const [isEvidenceOpen, setIsEvidenceOpen] = useState(false);
  const [isTourActive, setIsTourActive] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  // Load baseline investigation data on mount
  useEffect(() => {
    async function loadData() {
      try {
        const res = await investigateKPI('revenue', role, persona, 'normal');
        setInvestigationData(res);
      } catch (err) {
        console.error(err);
      }
    }
    loadData();
  }, [role, persona]);

  // Tour Action Dispatcher
  const handleTourAction = (actionKey) => {
    if (actionKey === 'insights') {
      setActiveTab('insights');
    } else if (actionKey === 'open_evidence') {
      setIsEvidenceOpen(true);
    } else if (actionKey === 'prediction') {
      setIsEvidenceOpen(false);
      setActiveTab('insights');
    } else if (actionKey === 'decisions') {
      setActiveTab('decisions');
    } else if (actionKey === 'scenarios') {
      setActiveTab('scenarios');
    } else if (actionKey === 'ask') {
      setActiveTab('ask');
    } else if (actionKey === 'diagnostics') {
      setIsDiagnosticsOpen(true);
    } else if (actionKey === 'home') {
      setIsDiagnosticsOpen(false);
      setActiveTab('home');
      setIsTourActive(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-[#111827] flex flex-col font-sans antialiased selection:bg-teal-900 selection:text-white">
      
      {/* App Shell & Navigation */}
      <AppShell
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        role={role}
        setRole={setRole}
        persona={persona}
        setPersona={setPersona}
        unreadAlertsCount={3}
        onOpenAlerts={() => setIsAlertsOpen(true)}
        onOpenDiagnostics={() => setIsDiagnosticsOpen(true)}
        onStartDemo={() => {
          setIsTourActive(true);
          setTourStep(0);
          setActiveTab('home');
        }}
      />

      {/* Main Content View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        
        {/* 1. HOME / OVERVIEW */}
        {activeTab === 'home' && (
          <HomeOverview
            role={role}
            onInvestigateSignal={(kpiId) => setActiveTab('insights')}
            onReviewDecision={() => setActiveTab('decisions')}
            onOpenOperations={() => setActiveTab('operations')}
            onOpenScenarios={() => setActiveTab('scenarios')}
          />
        )}

        {/* 2. OPERATIONS */}
        {activeTab === 'operations' && (
          <OperationsView
            onInitiateRebalance={() => setActiveTab('decisions')}
            onInvestigateDriver={() => setActiveTab('insights')}
          />
        )}

        {/* 3. INSIGHTS */}
        {activeTab === 'insights' && (
          <InsightsView
            investigationData={investigationData}
            onOpenEvidenceDrawer={() => setIsEvidenceOpen(true)}
            onOpenDecisions={() => setActiveTab('decisions')}
            role={role}
            persona={persona}
          />
        )}

        {/* 4. DECISIONS */}
        {activeTab === 'decisions' && (
          <DecisionCenter
            onOpenScenarios={() => setActiveTab('scenarios')}
          />
        )}

        {/* 5. SCENARIOS (WHAT IF?) */}
        {activeTab === 'scenarios' && (
          <ScenarioSimulation
            onApplyDecision={() => setActiveTab('decisions')}
          />
        )}

        {/* 6. ASK PAISAAN */}
        {activeTab === 'ask' && (
          <AskPaisaan
            role={role}
            persona={persona}
            onGoToInvestigation={() => setActiveTab('insights')}
          />
        )}

      </main>

      {/* Central Notification Alerts Drawer */}
      {isAlertsOpen && (
        <AlertsDrawer
          onClose={() => setIsAlertsOpen(false)}
          onSelectAlert={(tab) => setActiveTab(tab)}
        />
      )}

      {/* System Settings & Local Engine Diagnostics */}
      {isDiagnosticsOpen && (
        <SettingsDiagnostics
          role={role}
          setRole={setRole}
          persona={persona}
          setPersona={setPersona}
          onClose={() => setIsDiagnosticsOpen(false)}
        />
      )}

      {/* Evidence & Provenance Drawer */}
      {isEvidenceOpen && (
        <EvidenceDrawer
          onClose={() => setIsEvidenceOpen(false)}
        />
      )}

      {/* Judges Interactive Tour */}
      {isTourActive && (
        <DemoTourGuide
          currentStep={tourStep}
          onNext={() => setTourStep(prev => Math.min(7, prev + 1))}
          onPrev={() => setTourStep(prev => Math.max(0, prev - 1))}
          onClose={() => setIsTourActive(false)}
          onExecuteTourAction={handleTourAction}
        />
      )}

      {/* Clean Mobile-Friendly Subdued Footer */}
      <footer className="hidden md:block bg-white border-t border-gray-200 py-3 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between font-medium">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-800">Paisaan</span>
            <span className="text-gray-300">·</span>
            <span>Intelligent Decision-Control System</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-gray-400 font-mono">
            <span>OBSERVE → UNDERSTAND → PREDICT → DECIDE → VALIDATE</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
