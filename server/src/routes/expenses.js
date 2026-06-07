const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { expenses } = require('../store');

const router = express.Router();

const VALID_CATEGORIES = ['Food', 'Transport', 'Bills', 'Entertainment', 'Other'];

// ---------- helpers ----------

function validateExpense({ amount, category, date }, requireAll = true) {
  const errors = [];

  if (requireAll || amount !== undefined) {
    const parsed = Number(amount);
    if (isNaN(parsed) || parsed <= 0) errors.push('amount must be a positive number');
  }

  if (requireAll || category !== undefined) {
    if (!VALID_CATEGORIES.includes(category)) {
      errors.push(`category must be one of: ${VALID_CATEGORIES.join(', ')}`);
    }
  }

  if (requireAll || date !== undefined) {
    if (!date || isNaN(Date.parse(date))) {
      errors.push('date must be a valid date string');
    } else if (date > new Date().toISOString().split('T')[0]) {
      errors.push('date cannot be in the future');
    }
  }

  return errors;
}

// ---------- routes ----------

// GET /api/expenses  – list with optional filtering
router.get('/', (req, res) => {
  const { category, startDate, endDate } = req.query;

  let result = [...expenses];

  if (category && category !== 'All') {
    result = result.filter((e) => e.category === category);
  }

  if (startDate) {
    result = result.filter((e) => e.date >= startDate);
  }

  if (endDate) {
    result = result.filter((e) => e.date <= endDate);
  }

  // Sort newest first
  result.sort((a, b) => (b.date > a.date ? 1 : b.date < a.date ? -1 : 0));

  res.json(result);
});

// GET /api/expenses/summary  – aggregated stats
router.get('/summary', (req, res) => {
  const now = new Date();
  const thisMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const thisMonth = expenses.filter((e) => e.date.startsWith(thisMonthPrefix));

  const totalThisMonth = thisMonth.reduce((sum, e) => sum + e.amount, 0);

  const byCategory = VALID_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = thisMonth.filter((e) => e.category === cat).reduce((s, e) => s + e.amount, 0);
    return acc;
  }, {});

  const highest = expenses.length
    ? expenses.reduce((max, e) => (e.amount > max.amount ? e : max), expenses[0])
    : null;

  res.json({ totalThisMonth, byCategory, highest });
});

// GET /api/expenses/:id
router.get('/:id', (req, res) => {
  const expense = expenses.find((e) => e.id === req.params.id);
  if (!expense) return res.status(404).json({ error: 'Expense not found' });
  res.json(expense);
});

// POST /api/expenses
router.post('/', (req, res) => {
  const { amount, category, date, note = '' } = req.body;

  const errors = validateExpense({ amount, category, date });
  if (errors.length) return res.status(400).json({ errors });

  const expense = {
    id: uuidv4(),
    amount: Number(amount),
    category,
    date,
    note: note.trim(),
    createdAt: new Date().toISOString(),
  };

  expenses.unshift(expense);
  res.status(201).json(expense);
});

// PATCH /api/expenses/:id
router.patch('/:id', (req, res) => {
  const index = expenses.findIndex((e) => e.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Expense not found' });

  const { amount, category, date, note } = req.body;

  const errors = validateExpense({ amount, category, date }, false);
  if (errors.length) return res.status(400).json({ errors });

  const updated = { ...expenses[index] };
  if (amount  !== undefined) updated.amount   = Number(amount);
  if (category !== undefined) updated.category = category;
  if (date     !== undefined) updated.date     = date;
  if (note     !== undefined) updated.note     = note.trim();

  expenses[index] = updated;
  res.json(updated);
});

// DELETE /api/expenses/:id
router.delete('/:id', (req, res) => {
  const index = expenses.findIndex((e) => e.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Expense not found' });

  expenses.splice(index, 1);
  res.status(204).send();
});

module.exports = router;
