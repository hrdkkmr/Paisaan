import React, { useState } from 'react';
import { 
  GitFork, 
  Play, 
  RotateCcw, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingDown, 
  ShieldCheck,
  Sparkles,
  Layers
} from 'lucide-react';

export default function ScenarioSimulation({ onApplyDecision }) {
  const [activeScenarioId, setActiveScenarioId] = useState('sc_supply_20');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationRun, setSimulationRun] = useState(true);

  const scenarioTemplates = [
    {
      id: "sc_supply_20",
      title: "What if inbound supply drops by 20% in North Hub?",
      description: "Simulates prolonged port congestion extending inventory stockouts across all tier-1 Electronics SKUs.",
      baseline: {
        revenue: "₹9.10 Cr",
        orders: "14,200",
        profit_margin: "30.1%",
        risk: "Low",
        confidence: "94%"
      },
      simulated: {
        revenue: "₹8.42 Cr",
        revenue_diff: "-₹0.68 Cr (-7.4%)",
        orders: "12,940 (-8.8%)",
        profit_margin: "28.4% (-1.7 pts)",
        risk: "High",
        confidence: "88%"
      },
      recommended_response: "Pre-approve air-bridge split shipments from Vietnam hubs and immediately stage West Hub inventory."
    },
    {
      id: "sc_comp_discount",
      title: "What if South competitor deepens price discount to 20%?",
      description: "Simulates competitor aggressive market-share grab in consumer electronics and audio accessories.",
      baseline: {
        revenue: "₹9.10 Cr",
        orders: "14,200",
        profit_margin: "30.1%",
        risk: "Low",
        confidence: "94%"
      },
      simulated: {
        revenue: "₹8.65 Cr",
        revenue_diff: "-₹0.45 Cr (-4.9%)",
        orders: "13,400 (-5.6%)",
        profit_margin: "29.2% (-0.9 pts)",
        risk: "Medium",
        confidence: "82%"
      },
      recommended_response: "Deploy paired warranty & accessory value bundle to maintain price integrity without triggering margin erosion."
    },
    {
      id: "sc_mkt_lag",
      title: "What if ad platform pixel attribution lags by 48 hours?",
      description: "Simulates third-party ad tag corruption and double-firing conversions during a major sale event.",
      baseline: {
        revenue: "₹9.10 Cr",
        orders: "14,200",
        profit_margin: "30.1%",
        risk: "Low",
        confidence: "94%"
      },
      simulated: {
        revenue: "₹8.95 Cr",
        revenue_diff: "-₹0.15 Cr Ad Wastage",
        orders: "14,050 (-1.0%)",
        profit_margin: "29.8% (-0.3 pts)",
        risk: "High (Misallocated Capital)",
        confidence: "38% (Low)"
      },
      recommended_response: "Enforce automated budget caps on unverified pixel campaigns and isolate verified order transaction ledger."
    }
  ];

  const current = scenarioTemplates.find(s => s.id === activeScenarioId) || scenarioTemplates[0];

  const handleRun = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setSimulationRun(true);
    }, 400);
  };

  return (
    <div className="space-y-5 pb-20 md:pb-6">
      
      {/* Header */}
      <div className="paisaan-card p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Executive Digital Twin
          </span>
          <h2 className="text-lg font-bold text-gray-900 mt-1">
            "What If?" Scenario Simulation
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Test business shocks and simulate the financial and operational impact before committing capital.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRun}
            disabled={isSimulating}
            className="px-4 py-2 bg-teal-800 hover:bg-teal-700 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isSimulating ? "Simulating..." : "Run Simulation"}</span>
          </button>
        </div>
      </div>

      {/* Scenario Selector Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {scenarioTemplates.map((sc) => {
          const isSelected = sc.id === activeScenarioId;
          return (
            <button
              key={sc.id}
              onClick={() => {
                setActiveScenarioId(sc.id);
                setSimulationRun(true);
              }}
              className={`p-4 rounded-xl text-left border transition-all ${
                isSelected
                  ? 'bg-white border-teal-700 shadow-xs'
                  : 'bg-gray-50/60 hover:bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] font-mono font-bold uppercase ${isSelected ? 'text-teal-800' : 'text-gray-400'}`}>
                  Scenario
                </span>
                {isSelected && <span className="w-2 h-2 rounded-full bg-teal-700"></span>}
              </div>
              <h4 className="text-xs font-bold text-gray-900 leading-snug">
                {sc.title}
              </h4>
            </button>
          );
        })}
      </div>

      {/* Side-by-Side: BASELINE vs SIMULATION */}
      {simulationRun && (
        <div className="space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* BASELINE CARD */}
            <div className="paisaan-card p-5 space-y-3 bg-gray-50/40">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider font-mono">
                  1. Current Baseline
                </span>
                <span className="text-[10px] font-mono text-gray-400 font-semibold">
                  Status Quo
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-medium">Monthly Revenue</span>
                  <span className="text-base font-bold text-gray-900 font-mono">{current.baseline.revenue}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-medium">Order Volume</span>
                  <span className="text-base font-bold text-gray-800 font-mono">{current.baseline.orders}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-medium">Profit Margin</span>
                  <span className="text-sm font-bold text-gray-800 font-mono">{current.baseline.profit_margin}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-medium">Risk Level</span>
                  <span className="text-sm font-bold text-emerald-700">{current.baseline.risk}</span>
                </div>
              </div>
            </div>

            {/* SIMULATED OUTCOME CARD */}
            <div className="paisaan-card p-5 space-y-3 border-teal-300 bg-teal-50/20">
              <div className="flex items-center justify-between pb-2 border-b border-teal-200">
                <span className="text-xs font-bold text-teal-900 uppercase tracking-wider font-mono">
                  2. Simulated Shock Outcome
                </span>
                <span className="text-[10px] font-mono font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded">
                  Confidence: {current.simulated.confidence}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-medium">Simulated Revenue</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-bold text-red-700 font-mono">{current.simulated.revenue}</span>
                    <span className="text-[10px] font-mono font-semibold text-red-600">{current.simulated.revenue_diff}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-medium">Simulated Orders</span>
                  <span className="text-base font-bold text-gray-900 font-mono">{current.simulated.orders}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-medium">Profit Margin</span>
                  <span className="text-sm font-bold text-red-700 font-mono">{current.simulated.profit_margin}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-medium">Risk Level</span>
                  <span className="text-sm font-bold text-red-700">{current.simulated.risk}</span>
                </div>
              </div>
            </div>

          </div>

          {/* RECOMMENDED RESPONSE PLAYBOOK */}
          <div className="paisaan-card p-5 space-y-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block pb-2 border-b border-gray-100">
              Paisaan Recommended Response Playbook
            </span>

            <p className="text-xs text-gray-800 leading-relaxed font-medium">
              {current.recommended_response}
            </p>

            <div className="pt-2 flex justify-end">
              <button
                onClick={onApplyDecision}
                className="px-3.5 py-1.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span>Commit Decision to Action Pipeline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
