import React, { useState, useEffect } from 'react';
import styles from './BudgetModal.module.css';
import { formatCurrency } from '../utils';

export default function BudgetModal({ category, current, onSave, onClose }) {
  const [value, setValue] = useState(String(current || ''));
  const [error, setError] = useState('');

  useEffect(() => {
    setValue(String(current || ''));
    setError('');
  }, [category, current]);

  function handleSave() {
    const n = Number(value);
    if (isNaN(n) || n < 0) { setError('Enter a valid non-negative amount'); return; }
    onSave(category, n);
    onClose();
  }

  if (!category) return null;

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>Budget for {category}</h2>
        {current > 0 && (
          <p className={styles.current}>Current: {formatCurrency(current)}</p>
        )}
        <div className={styles.field}>
          <label htmlFor="budgetInput">Monthly limit (₹)</label>
          <input
            id="budgetInput"
            type="number"
            min="0"
            placeholder="e.g. 5000"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
            className={error ? styles.invalid : ''}
          />
          {error && <span className={styles.error}>{error}</span>}
        </div>
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.saveBtn} onClick={handleSave}>Save Budget</button>
        </div>
      </div>
    </div>
  );
}
