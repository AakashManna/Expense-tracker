import { useState, useEffect, useCallback } from 'react';
import * as api from '../api';
import { getDateRange } from '../utils';

export default function useExpenses() {
  const [expenses, setExpenses]   = useState([]);
  const [summary,  setSummary]    = useState(null);
  const [budgets,  setBudgets]    = useState({});
  const [loading,  setLoading]    = useState(true);
  const [error,    setError]      = useState(null);

  // Filters
  const [category,   setCategory]   = useState('All');
  const [datePreset, setDatePreset] = useState('this_month');
  const [customStart, setCustomStart] = useState('');
  const [customEnd,   setCustomEnd]   = useState('');

  const buildParams = useCallback(() => {
    const params = {};
    if (category !== 'All') params.category = category;
    if (datePreset === 'custom') {
      if (customStart) params.startDate = customStart;
      if (customEnd)   params.endDate   = customEnd;
    } else if (datePreset !== 'all') {
      Object.assign(params, getDateRange(datePreset));
    }
    return params;
  }, [category, datePreset, customStart, customEnd]);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [exp, sum, bud] = await Promise.all([
        api.getExpenses(buildParams()),
        api.getSummary(),
        api.getBudgets(),
      ]);
      setExpenses(exp);
      setSummary(sum);
      setBudgets(bud);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [buildParams]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const addExpense = async (data) => {
    const created = await api.createExpense(data);
    await fetchAll();
    return created;
  };

  const editExpense = async (id, data) => {
    const updated = await api.updateExpense(id, data);
    await fetchAll();
    return updated;
  };

  const removeExpense = async (id) => {
    await api.deleteExpense(id);
    await fetchAll();
  };

  const saveBudget = async (cat, limit) => {
    await api.updateBudget(cat, limit);
    const fresh = await api.getBudgets();
    setBudgets(fresh);
  };

  return {
    expenses, summary, budgets, loading, error,
    // filters
    category, setCategory,
    datePreset, setDatePreset,
    customStart, setCustomStart,
    customEnd, setCustomEnd,
    // mutations
    addExpense, editExpense, removeExpense, saveBudget,
    refresh: fetchAll,
  };
}
