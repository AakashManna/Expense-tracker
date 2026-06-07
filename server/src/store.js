/**
 * In-memory store for expenses and budgets.
 * Seeded with a small set of sample data so reviewers see a populated UI immediately.
 */

const { v4: uuidv4 } = require('uuid');

const today = new Date();
const fmt = (offset) => {
  const d = new Date(today);
  d.setDate(d.getDate() - offset);
  return d.toISOString().split('T')[0];
};

const expenses = [
  { id: uuidv4(), amount: 450,  category: 'Food',          date: fmt(0),  note: 'Grocery run',          createdAt: new Date().toISOString() },
  { id: uuidv4(), amount: 1200, category: 'Bills',         date: fmt(1),  note: 'Electricity bill',     createdAt: new Date().toISOString() },
  { id: uuidv4(), amount: 300,  category: 'Transport',     date: fmt(2),  note: 'Auto fare',            createdAt: new Date().toISOString() },
  { id: uuidv4(), amount: 850,  category: 'Entertainment', date: fmt(3),  note: 'Movie + dinner',       createdAt: new Date().toISOString() },
  { id: uuidv4(), amount: 200,  category: 'Food',          date: fmt(4),  note: 'Coffee & snacks',      createdAt: new Date().toISOString() },
  { id: uuidv4(), amount: 3500, category: 'Bills',         date: fmt(5),  note: 'Internet + streaming', createdAt: new Date().toISOString() },
  { id: uuidv4(), amount: 600,  category: 'Other',         date: fmt(7),  note: 'Birthday gift',        createdAt: new Date().toISOString() },
  { id: uuidv4(), amount: 150,  category: 'Transport',     date: fmt(10), note: 'Cab to airport',       createdAt: new Date().toISOString() },
];

const budgets = {
  Food:          5000,
  Transport:     2000,
  Bills:         8000,
  Entertainment: 3000,
  Other:         2000,
};

module.exports = { expenses, budgets };
