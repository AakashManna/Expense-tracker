import React, { useState, useEffect } from 'react';
import { CATEGORIES } from '../utils';
import styles from './ExpenseForm.module.css';

const today = () => new Date().toISOString().split('T')[0];

const EMPTY = { amount: '', category: '', date: today(), note: '' };

export default function ExpenseForm({ initial = null, onSubmit, onCancel }) {
  const [form,   setForm]   = useState(initial ? { ...initial, amount: String(initial.amount) } : EMPTY);
  const [errors, setErrors] = useState({});
  const [busy,   setBusy]   = useState(false);

  useEffect(() => {
    setForm(initial ? { ...initial, amount: String(initial.amount) } : EMPTY);
    setErrors({});
  }, [initial]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  function validate() {
    const e = {};
    const amount = Number(form.amount);
    if (!form.amount || isNaN(amount) || amount <= 0) e.amount = 'Enter a positive amount';
    if (!form.category) e.category = 'Select a category';
    if (!form.date) e.date = 'Pick a date';
    else if (form.date > today()) e.date = 'Date cannot be in the future';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setBusy(true);
    try {
      await onSubmit({ amount: Number(form.amount), category: form.category, date: form.date, note: form.note });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="amount">Amount (₹)</label>
          <input
            id="amount"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="0.00"
            value={form.amount}
            onChange={set('amount')}
            className={errors.amount ? styles.invalid : ''}
          />
          {errors.amount && <span className={styles.error}>{errors.amount}</span>}
        </div>

        <div className={styles.field}>
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={form.category}
            onChange={set('category')}
            className={errors.category ? styles.invalid : ''}
          >
            <option value="" disabled>Select…</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.category && <span className={styles.error}>{errors.category}</span>}
        </div>

        <div className={styles.field}>
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            max={today()}
            value={form.date}
            onChange={set('date')}
            className={errors.date ? styles.invalid : ''}
          />
          {errors.date && <span className={styles.error}>{errors.date}</span>}
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="note">Note (optional)</label>
        <input
          id="note"
          type="text"
          placeholder="What was this for?"
          value={form.note}
          onChange={set('note')}
          maxLength={120}
        />
      </div>

      <div className={styles.actions}>
        {onCancel && (
          <button type="button" className={styles.cancelBtn} onClick={onCancel} disabled={busy}>
            Cancel
          </button>
        )}
        <button type="submit" className={styles.submitBtn} disabled={busy}>
          {busy ? 'Saving…' : initial ? 'Save Changes' : '+ Add Expense'}
        </button>
      </div>
    </form>
  );
}
