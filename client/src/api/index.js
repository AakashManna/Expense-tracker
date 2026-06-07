const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (res.status === 204) return null;

  const data = await res.json();
  if (!res.ok) {
    const message = data.errors ? data.errors.join(', ') : data.error || 'Request failed';
    throw new Error(message);
  }
  return data;
}

// Expenses
export const getExpenses = (params = {}) => {
  const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v)).toString();
  return request(`/expenses${qs ? `?${qs}` : ''}`);
};

export const getSummary = () => request('/expenses/summary');

export const createExpense = (body) =>
  request('/expenses', { method: 'POST', body: JSON.stringify(body) });

export const updateExpense = (id, body) =>
  request(`/expenses/${id}`, { method: 'PATCH', body: JSON.stringify(body) });

export const deleteExpense = (id) =>
  request(`/expenses/${id}`, { method: 'DELETE' });

// Budgets
export const getBudgets = () => request('/budgets');

export const updateBudget = (category, limit) =>
  request(`/budgets/${category}`, { method: 'PUT', body: JSON.stringify({ limit }) });
