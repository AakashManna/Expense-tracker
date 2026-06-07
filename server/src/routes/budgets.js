const express = require('express');
const { budgets } = require('../store');

const router = express.Router();

const VALID_CATEGORIES = ['Food', 'Transport', 'Bills', 'Entertainment', 'Other'];

// GET /api/budgets
router.get('/', (_req, res) => {
  res.json(budgets);
});

// PUT /api/budgets/:category  – set / update a category budget
router.put('/:category', (req, res) => {
  const { category } = req.params;
  const { limit } = req.body;

  if (!VALID_CATEGORIES.includes(category)) {
    return res.status(400).json({ error: `category must be one of: ${VALID_CATEGORIES.join(', ')}` });
  }

  const parsed = Number(limit);
  if (isNaN(parsed) || parsed < 0) {
    return res.status(400).json({ error: 'limit must be a non-negative number' });
  }

  budgets[category] = parsed;
  res.json({ category, limit: parsed });
});

module.exports = router;
