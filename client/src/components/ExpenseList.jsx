import React, { useState } from 'react';
import { formatCurrency, formatDate, CATEGORY_COLORS } from '../utils';
import ExpenseForm from './ExpenseForm';
import styles from './ExpenseList.module.css';

export default function ExpenseList({ expenses, onEdit, onDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  async function handleEdit(id, data) {
    await onEdit(id, data);
    setEditingId(null);
  }

  async function handleDelete(id) {
    await onDelete(id);
    setConfirmId(null);
  }

  if (expenses.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>₹</span>
        <p>No expenses found.</p>
        <p className={styles.emptySub}>Add one above or adjust your filters.</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Note</th>
            <th className={styles.right}>Amount</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp) => (
            <React.Fragment key={exp.id}>
              <tr className={editingId === exp.id ? styles.rowEditing : ''}>
                <td className={`${styles.dateCell} mono`}>{formatDate(exp.date)}</td>
                <td>
                  <span
                    className={styles.catBadge}
                    style={{
                      background: CATEGORY_COLORS[exp.category] + '22',
                      color: CATEGORY_COLORS[exp.category],
                      borderColor: CATEGORY_COLORS[exp.category] + '55',
                    }}
                  >
                    {exp.category}
                  </span>
                </td>
                <td className={styles.noteCell}>{exp.note || <span className={styles.noNote}>—</span>}</td>
                <td className={`${styles.right} ${styles.amount} mono`}>{formatCurrency(exp.amount)}</td>
                <td className={styles.actions}>
                  <button
                    className={styles.iconBtn}
                    onClick={() => setEditingId(editingId === exp.id ? null : exp.id)}
                    aria-label="Edit expense"
                    title="Edit"
                  >
                    ✎
                  </button>
                  <button
                    className={`${styles.iconBtn} ${styles.deleteBtn}`}
                    onClick={() => setConfirmId(exp.id)}
                    aria-label="Delete expense"
                    title="Delete"
                  >
                    ✕
                  </button>
                </td>
              </tr>

              {editingId === exp.id && (
                <tr className={styles.editRow}>
                  <td colSpan={5}>
                    <div className={styles.editWrapper}>
                      <ExpenseForm
                        initial={exp}
                        onSubmit={(data) => handleEdit(exp.id, data)}
                        onCancel={() => setEditingId(null)}
                      />
                    </div>
                  </td>
                </tr>
              )}

              {confirmId === exp.id && (
                <tr className={styles.confirmRow}>
                  <td colSpan={5}>
                    <div className={styles.confirmWrapper}>
                      <span>Delete <strong>{exp.note || exp.category}</strong>?</span>
                      <button className={styles.confirmYes} onClick={() => handleDelete(exp.id)}>
                        Delete
                      </button>
                      <button className={styles.confirmNo} onClick={() => setConfirmId(null)}>
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
