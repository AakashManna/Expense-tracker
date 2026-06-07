import React from 'react';
import { CATEGORIES, DATE_PRESETS } from '../utils';
import styles from './FilterBar.module.css';

export default function FilterBar({
  category, setCategory,
  datePreset, setDatePreset,
  customStart, setCustomStart,
  customEnd, setCustomEnd,
  totalCount,
}) {
  return (
    <div className={styles.bar}>
      <div className={styles.group}>
        <label className={styles.label}>Category</label>
        <div className={styles.chips}>
          {['All', ...CATEGORIES].map((c) => (
            <button
              key={c}
              className={`${styles.chip} ${category === c ? styles.active : ''}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <label className={styles.label}>Period</label>
        <div className={styles.chips}>
          {DATE_PRESETS.map((p) => (
            <button
              key={p.value}
              className={`${styles.chip} ${datePreset === p.value ? styles.active : ''}`}
              onClick={() => setDatePreset(p.value)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {datePreset === 'custom' && (
        <div className={styles.customRange}>
          <input
            type="date"
            value={customStart}
            onChange={(e) => setCustomStart(e.target.value)}
            className={styles.dateInput}
            aria-label="Start date"
          />
          <span className={styles.rangeSep}>→</span>
          <input
            type="date"
            value={customEnd}
            onChange={(e) => setCustomEnd(e.target.value)}
            className={styles.dateInput}
            aria-label="End date"
          />
        </div>
      )}

      <span className={styles.count}>
        {totalCount} {totalCount === 1 ? 'expense' : 'expenses'}
      </span>
    </div>
  );
}
