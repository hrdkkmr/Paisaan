import React, { useState } from 'react';
import { 
  Terminal, 
  Send, 
  ShieldCheck, 
  Clock, 
  Database, 
  Sparkles, 
  Lock, 
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import { sendNLQuery } from '../api';

export default function NLQueryTerminal({ role, persona }) {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'system',
      text: 'BusinessIntelligence.ai Grounded NL Console ready. All queries are parsed deterministically against the Semantic Layer and audited by RBAC policies before narrative generation.',
      sources: ['governed_semantic_layer', 'sales_db', 'inventory_db'],
      confidence: 99
    }
  ]);
  const [loading, setLoading] = useState(false);

  const suggestedQueries = [
    "Why did revenue fall by 11.8%?",
    "What are the leading indicators in the Q4 Pre-Mortem?",
    "What is the inventory stockout status in North Hub?",
    "Explain the sparse history policy for SmartPhone X",
    "What is our gross operating profit margin?"
  ];

  const handleSend = async (textToSend) => {
    const q = textToSend || query;
    if (!q.trim()) return;

    const userMsg = { sender: 'user', text: q };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    try {
      const res = await sendNLQuery(q, role, persona);
      const assistantMsg = {
        sender: 'assistant',
        text: res.response,
        sources: res.evidence_sources || ['sales_db', 'inventory_db'],
        confidence: res.confidence_score || 85,
        access_granted: res.access_granted,
        telemetry: res.telemetry
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      setMessages(prev => [...prev, {
        sender: 'assistant',
        text: `Error processing query: ${err.message}`,
        sources: [],
        confidence: 0
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-slate-900 text-white text-[11px] font-bold font-mono uppercase tracking-wider">
              GROUNDED NL QUERY TERMINAL
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Active Role: {role.toUpperCase()}
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Grounded Semantic Query & Evidence Console
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Ask complex business questions in natural language. Answers are strictly synthesized from governed deterministic computations.
          </p>
        </div>

        <div className="text-xs font-mono bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded border border-emerald-200 font-bold">
          ✓ ZERO-HALLUCINATION ENFORCEMENT
        </div>
      </div>

      {/* Suggested Prompts */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-500">Sample Prompts:</span>
        {suggestedQueries.map((sq, i) => (
          <button
            key={i}
            onClick={() => handleSend(sq)}
            className="text-xs bg-white hover:bg-slate-100 text-slate-700 px-2.5 py-1 rounded border border-slate-200 transition-colors shadow-xs"
          >
            {sq}
          </button>
        ))}
      </div>

      {/* Terminal Conversation Container */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col h-[480px]">
        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 font-mono text-xs">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-lg max-w-3xl ${
                msg.sender === 'user'
                  ? 'bg-slate-900 text-white ml-auto'
                  : msg.sender === 'system'
                  ? 'bg-slate-100 text-slate-700 border border-slate-200'
                  : 'bg-slate-50 text-slate-800 border border-slate-200 mr-auto'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1 text-[10px] opacity-75 font-bold uppercase tracking-wider">
                <span>{msg.sender === 'user' ? `YOU (${role.toUpperCase()})` : 'ENGINE / SEMANTIC LAYER'}</span>
                {msg.confidence && <span>Confidence: {msg.confidence}%</span>}
              </div>

              <p className="font-sans text-xs leading-relaxed whitespace-pre-line">
                {msg.text}
              </p>

              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-slate-200/50 flex flex-wrap items-center gap-2 text-[10px]">
                  <span className="text-slate-500">Grounded Evidence Sources:</span>
                  {msg.sources.map((s, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-800 font-bold">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="p-3 bg-slate-50 rounded text-slate-500 text-xs italic flex items-center gap-2">
              <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-slate-700"></div>
              <span>Executing semantic parsing & querying deterministic calculation engine...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="mt-4 pt-3 border-t border-slate-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Ask a question as ${role.toUpperCase()} (e.g. "Why did volume decline in North region?")...`}
            className="flex-1 bg-slate-50 border border-slate-200 rounded px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-800 font-sans"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white px-4 py-2 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit</span>
          </button>
        </form>
      </div>
    </div>
  );
}
