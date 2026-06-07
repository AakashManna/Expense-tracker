import React from 'react';
import { formatCurrency, CATEGORIES, CATEGORY_COLORS } from '../utils';
import styles from './SummaryPanel.module.css';

export default function SummaryPanel({ summary, budgets, onEditBudget }) {
  if (!summary) return null;

  const { totalThisMonth, byCategory, highest } = summary;

  return (
    <aside className={styles.panel}>
      <div className={styles.totalCard}>
        <span className={styles.label}>Spent this month</span>
        <span className={`${styles.totalAmount} mono`}>{formatCurrency(totalThisMonth)}</span>
      </div>

      {highest && (
        <div className={styles.highestCard}>
          <span className={styles.label}>Highest expense</span>
          <span className={`${styles.highestAmount} mono`}>{formatCurrency(highest.amount)}</span>
          <span className={styles.highestNote}>{highest.note || highest.category}</span>
        </div>
      )}

      <div className={styles.categories}>
        <h3 className={styles.sectionTitle}>By Category</h3>
        {CATEGORIES.map((cat) => {
          const spent  = byCategory[cat] || 0;
          const budget = budgets[cat]    || 0;
          const pct    = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
          const over   = budget > 0 && spent > budget;

          return (
            <div key={cat} className={styles.catRow}>
              <div className={styles.catHeader}>
                <span className={styles.catDot} style={{ background: CATEGORY_COLORS[cat] }} />
                <span className={styles.catName}>{cat}</span>
                <button
                  className={styles.editBudgetBtn}
                  onClick={() => onEditBudget(cat, budget)}
                  title="Set budget"
                  aria-label={`Edit budget for ${cat}`}
                >
                  ✎
                </button>
                <span className={`${styles.catAmount} mono ${over ? styles.over : ''}`}>
                  {formatCurrency(spent)}
                  {budget > 0 && <span className={styles.budgetOf}> / {formatCurrency(budget)}</span>}
                </span>
              </div>
              {budget > 0 && (
                <div className={styles.bar} aria-label={`${Math.round(pct)}% of budget used`}>
                  <div
                    className={`${styles.fill} ${over ? styles.fillOver : ''}`}
                    style={{
                      width: `${pct}%`,
                      background: over ? 'var(--red)' : CATEGORY_COLORS[cat],
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
