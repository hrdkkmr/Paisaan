import React from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export default function DemoTourGuide({
  currentStep,
  onNext,
  onPrev,
  onClose,
  onExecuteTourAction
}) {
  const steps = [
    {
      number: 1,
      title: "1. Observe: Business Health & Priority Signal",
      description: "Paisaan opens with immediate situational clarity: Business Health is 82, but 1 Priority Signal requires attention (Revenue is 11.8% below target, ₹3.2 Cr variance in North Hub).",
      actionLabel: "Investigate Why",
      targetAction: () => onExecuteTourAction('insights')
    },
    {
      number: 2,
      title: "2. Understand: Root Driver Decomposition",
      description: "Mathematical waterfall variance analysis reveals Unit Volume Contraction (-5.4%) and North Hub Stockouts (-2.2%) are the primary likely contributors.",
      actionLabel: "Examine Evidence",
      targetAction: () => onExecuteTourAction('open_evidence')
    },
    {
      number: 3,
      title: "3. Validate: Multi-Source Provenance",
      description: "Inspect reconciled sources: 190k Sales transactions (30m lag) corroborated by WMS 6-hour inventory snapshots. No hallucinated data.",
      actionLabel: "View Forward-Looking Risk",
      targetAction: () => onExecuteTourAction('prediction')
    },
    {
      number: 4,
      title: "4. Predict: Forward-Looking Risk Before Action",
      description: "Proactive pre-mortem radar detects a 72% probability of Q4 target failure (₹4.1 Cr shortfall) led by inbound port congestion (34% weight).",
      actionLabel: "Review Decision Center",
      targetAction: () => onExecuteTourAction('decisions')
    },
    {
      number: 5,
      title: "5. Decide: Closed-Loop Decision Center",
      description: "Actionable decision: Reallocate 1,570 units from West Central Hub (surplus 140% cover) to North Hub $\to$ ₹1.4–1.9 Cr protected $\to$ 72h SLA check.",
      actionLabel: "Run What-If Simulation",
      targetAction: () => onExecuteTourAction('scenarios')
    },
    {
      number: 6,
      title: "6. Simulate: Executive 'What If?' Digital Twin",
      description: "Simulate a 20% supply drop to test operational resilience and compare Baseline vs Simulated revenue before committing capital.",
      actionLabel: "Ask Paisaan Assistant",
      targetAction: () => onExecuteTourAction('ask')
    },
    {
      number: 7,
      title: "7. Inquire: Contextual 'Ask Paisaan' Assistant",
      description: "Ask decision questions in plain English to receive structured findings with verified data citations and zero hallucinations.",
      actionLabel: "Check System Performance",
      targetAction: () => onExecuteTourAction('diagnostics')
    },
    {
      number: 8,
      title: "8. Engine: Local Computational Diagnostics",
      description: "Paisaan executes complex variance decomposition locally in 48ms over 190k events. Complete decision-control loop finished!",
      actionLabel: "Return to Home",
      targetAction: () => onExecuteTourAction('home')
    }
  ];

  const current = steps[currentStep] || steps[0];

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 max-w-sm w-full bg-gray-900 text-white rounded-2xl p-5 shadow-2xl border border-gray-700 animate-in fade-in slide-in-from-bottom-4">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-800">
        <div className="flex items-center gap-1.5 text-teal-400 font-bold text-xs">
          <Sparkles className="w-4 h-4" />
          <span>Paisaan Executive Tour ({current.number} of {steps.length})</span>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Description */}
      <div className="my-3 space-y-1.5">
        <h4 className="text-sm font-bold text-white leading-snug">
          {current.title}
        </h4>
        <p className="text-xs text-gray-300 leading-relaxed">
          {current.description}
        </p>
      </div>

      {/* Progress Dots */}
      <div className="flex items-center gap-1 my-3">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === currentStep ? 'w-5 bg-teal-400' : i < currentStep ? 'w-1.5 bg-gray-500' : 'w-1.5 bg-gray-800'
            }`}
          />
        ))}
      </div>

      {/* Footer Controls */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-800 text-xs">
        <div className="flex items-center gap-1">
          <button
            onClick={onPrev}
            disabled={currentStep === 0}
            className="p-1 rounded bg-gray-800 hover:bg-gray-700 disabled:opacity-30 text-gray-300"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={onNext}
            disabled={currentStep === steps.length - 1}
            className="p-1 rounded bg-gray-800 hover:bg-gray-700 disabled:opacity-30 text-gray-300"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={() => {
            if (current.targetAction) current.targetAction();
            if (currentStep < steps.length - 1) onNext();
            else onClose();
          }}
          className="px-3 py-1.5 bg-teal-700 hover:bg-teal-600 text-white font-semibold rounded-lg text-xs flex items-center gap-1 shadow-xs transition-colors"
        >
          <span>{current.actionLabel}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
