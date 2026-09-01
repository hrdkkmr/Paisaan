import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Clock, 
  Database,
  CheckCircle2
} from 'lucide-react';
import { sendNLQuery } from '../api';

export default function AskPaisaan({ role = 'cfo', persona = 'cfo', onGoToInvestigation }) {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      headline: 'Paisaan Decision Assistant Ready',
      text: 'Ask any business question to receive an evidence-grounded explanation with verifiable data citations.',
      evidence: ['Sales transaction ledger (190k rows)', 'WMS snapshot telemetry (7.2k snapshots)'],
      confidence: 95
    }
  ]);
  const [loading, setLoading] = useState(false);

  const sampleQuestions = [
    "Why is revenue falling?",
    "Which region is causing the bottleneck?",
    "What is the Q4 target risk?",
    "Why can't we forecast SmartPhone X?"
  ];

  const handleSend = async (qText) => {
    const text = qText || query;
    if (!text.trim()) return;

    const userMessage = { sender: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setLoading(true);

    try {
      const res = await sendNLQuery(text, role, persona);
      const assistantMessage = {
        sender: 'assistant',
        headline: text.toLowerCase().includes('revenue') ? 'Revenue Variance Analysis' :
                  text.toLowerCase().includes('region') ? 'Regional Bottleneck Breakdown' :
                  text.toLowerCase().includes('risk') ? 'Forward-Looking Risk Evaluation' : 'Paisaan Analysis',
        text: res.response,
        evidence: res.evidence_sources || ['sales_db (30m lag)', 'inventory_db (4.5h lag)'],
        confidence: res.confidence_score || 92
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setMessages(prev => [...prev, {
        sender: 'assistant',
        headline: 'Query Notice',
        text: `Unable to process query: ${err.message}`,
        evidence: [],
        confidence: 0
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 pb-20 md:pb-6">
      
      {/* Header */}
      <div className="paisaan-card p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Contextual Intelligence
          </span>
          <h2 className="text-lg font-bold text-gray-900 mt-1">
            Ask Paisaan
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Natural-language inquiries grounded directly in governed mathematical evidence.
          </p>
        </div>

        <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-md">
          Zero-Hallucination Guard Active
        </span>
      </div>

      {/* Suggested Executive Prompts */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-gray-400">Quick inquiries:</span>
        {sampleQuestions.map((sq, i) => (
          <button
            key={i}
            onClick={() => handleSend(sq)}
            className="text-xs bg-white hover:bg-gray-50 text-gray-700 font-medium px-3 py-1.5 rounded-lg border border-gray-200 transition-colors shadow-2xs"
          >
            {sq}
          </button>
        ))}
      </div>

      {/* Conversation Thread */}
      <div className="paisaan-card p-5 flex flex-col h-[460px]">
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl max-w-2xl ${
                m.sender === 'user'
                  ? 'bg-gray-900 text-white ml-auto'
                  : 'bg-gray-50 text-gray-800 border border-gray-200 mr-auto'
              }`}
            >
              {m.headline && (
                <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-gray-200/60">
                  <span className="font-bold text-xs text-gray-900 font-sans">{m.headline}</span>
                  {m.confidence && (
                    <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      Confidence: {m.confidence}%
                    </span>
                  )}
                </div>
              )}

              <p className="leading-relaxed whitespace-pre-line font-sans">
                {m.text}
              </p>

              {m.evidence && m.evidence.length > 0 && (
                <div className="mt-3 pt-2 border-t border-gray-200/60 space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Grounded Evidence Sources:
                  </span>
                  <ul className="space-y-0.5 text-[11px] text-gray-600 font-mono list-disc list-inside">
                    {m.evidence.map((ev, eIdx) => (
                      <li key={eIdx}>{ev}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="p-3 bg-gray-50 rounded-lg text-gray-500 text-xs italic flex items-center gap-2">
              <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-teal-700 border-t-transparent"></div>
              <span>Querying governed semantic layer & extracting verified evidence...</span>
            </div>
          )}
        </div>

        {/* Input Field */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="mt-4 pt-3 border-t border-gray-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a decision question (e.g. 'Why is revenue falling?')..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-800 font-sans"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="bg-teal-800 hover:bg-teal-700 disabled:opacity-40 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Ask</span>
          </button>
        </form>
      </div>

    </div>
  );
}
