/**
 * API Client for BusinessIntelligence.ai Engine
 */

const API_BASE = '/api';

export async function getHealth() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error(`Health check failed: ${res.statusText}`);
  return res.json();
}

export async function getOverview(role = 'cfo', region = 'All', category = 'All') {
  const params = new URLSearchParams({ role, region, category });
  const res = await fetch(`${API_BASE}/overview?${params}`);
  if (!res.ok) throw new Error(`Failed to load overview: ${res.statusText}`);
  return res.json();
}

export async function getKPIContract(kpiId, role = 'cfo') {
  const params = new URLSearchParams({ role });
  const res = await fetch(`${API_BASE}/kpi/${kpiId}/contracts?${params}`);
  if (!res.ok) throw new Error(`Failed to load KPI contract: ${res.statusText}`);
  return res.json();
}

export async function investigateKPI(kpiId, role = 'cfo', persona = 'cfo', contextOverride = null) {
  const params = new URLSearchParams({ role, persona });
  if (contextOverride) {
    params.append('context_override', contextOverride);
  }
  const res = await fetch(`${API_BASE}/kpi/${kpiId}/investigate?${params}`);
  if (!res.ok) throw new Error(`Failed to investigate KPI: ${res.statusText}`);
  return res.json();
}

export async function getFinancialPreMortem(role = 'cfo', persona = 'cfo') {
  const params = new URLSearchParams({ role, persona });
  const res = await fetch(`${API_BASE}/pre-mortem?${params}`);
  if (!res.ok) throw new Error(`Failed to load Pre-Mortem: ${res.statusText}`);
  return res.json();
}

export async function submitFeedback(payload) {
  const res = await fetch(`${API_BASE}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(`Failed to submit feedback: ${res.statusText}`);
  return res.json();
}

export async function sendNLQuery(query, role = 'cfo', persona = 'cfo', contextKpi = 'revenue') {
  const res = await fetch(`${API_BASE}/nl-query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, user_role: role, persona, context_kpi: contextKpi })
  });
  if (!res.ok) throw new Error(`Failed to process NL query: ${res.statusText}`);
  return res.json();
}

export async function loadScenario(scenarioId, role = 'cfo', persona = 'cfo') {
  const params = new URLSearchParams({ role, persona });
  const res = await fetch(`${API_BASE}/scenario/${scenarioId}?${params}`);
  if (!res.ok) throw new Error(`Failed to load scenario: ${res.statusText}`);
  return res.json();
}

export async function getTelemetryHistory() {
  const res = await fetch(`${API_BASE}/telemetry`);
  if (!res.ok) throw new Error(`Failed to load telemetry: ${res.statusText}`);
  return res.json();
}

export async function getReconciliationSources() {
  const res = await fetch(`${API_BASE}/reconciliation/sources`);
  if (!res.ok) throw new Error(`Failed to load sources metadata: ${res.statusText}`);
  return res.json();
}
