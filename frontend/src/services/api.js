const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE_URL}/api/health`);
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}

export async function submitCitizenRequest(data) {
  const res = await fetch(`${API_BASE_URL}/api/requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Submission failed' }));
    throw new Error(err.detail || 'Submission failed');
  }
  return res.json();
}

export async function analyzeCitizenRequest(data) {
  const res = await fetch(`${API_BASE_URL}/api/requests/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Analysis failed' }));
    throw new Error(err.detail || 'Analysis failed');
  }
  return res.json();
}

export async function fetchAllRequests(filters = {}) {
  const query = new URLSearchParams();
  if (filters.state) query.append('state', filters.state);
  if (filters.district) query.append('district', filters.district);
  if (filters.category) query.append('category', filters.category);
  if (filters.min_priority) query.append('min_priority', filters.min_priority);

  const res = await fetch(`${API_BASE_URL}/api/requests?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch requests');
  return res.json();
}

export async function fetchDashboardSummary() {
  const res = await fetch(`${API_BASE_URL}/api/dashboard/summary`);
  if (!res.ok) throw new Error('Failed to fetch summary');
  return res.json();
}

export async function fetchHotspots(state = '') {
  const query = state ? `?state=${encodeURIComponent(state)}` : '';
  const res = await fetch(`${API_BASE_URL}/api/dashboard/hotspots${query}`);
  if (!res.ok) throw new Error('Failed to fetch hotspots');
  return res.json();
}

export async function fetchCategoryDistribution() {
  const res = await fetch(`${API_BASE_URL}/api/dashboard/categories`);
  if (!res.ok) throw new Error('Failed to fetch category distribution');
  return res.json();
}

export async function fetchStateDistribution() {
  const res = await fetch(`${API_BASE_URL}/api/dashboard/states`);
  if (!res.ok) throw new Error('Failed to fetch state distribution');
  return res.json();
}

export async function generatePolicyBrief(data) {
  const res = await fetch(`${API_BASE_URL}/api/recommendations/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Policy generation failed' }));
    throw new Error(err.detail || 'Policy generation failed');
  }
  return res.json();
}
