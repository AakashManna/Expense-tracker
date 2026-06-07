import React, { useState } from 'react';
import useExpenses from './hooks/useExpenses';
import SummaryPanel from './components/SummaryPanel';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import FilterBar from './components/FilterBar';
import CategoryChart from './components/CategoryChart';
import BudgetModal from './components/BudgetModal';
import { exportToCSV } from './utils/exportCSV';
import styles from './App.module.css';

export default function App() {
  const {
    expenses, summary, budgets, loading, error,
    category, setCategory,
    datePreset, setDatePreset,
    customStart, setCustomStart,
    customEnd, setCustomEnd,
    addExpense, editExpense, removeExpense, saveBudget,
  } = useExpenses();

  const [formError, setFormError]   = useState('');
  const [budgetEdit, setBudgetEdit] = useState(null); // { category, current }

  async function handleAdd(data) {
    try {
      setFormError('');
      await addExpense(data);
    } catch (err) {
      setFormError(err.message);
    }
  }

  return (
    <div className={styles.app}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div>
            <h1 className={styles.logo}>₹ Tracker</h1>
            <p className={styles.tagline}>Keep tabs on every rupee</p>
          </div>
          <button
            className={styles.exportBtn}
            onClick={() => exportToCSV(expenses)}
            disabled={expenses.length === 0}
            title="Export visible expenses as CSV"
          >
            ↓ Export CSV
          </button>
        </div>
      </header>

      <main className={styles.main}>
        {/* Add expense form */}
        <section className={styles.addSection}>
          <h2 className={styles.sectionHeading}>Add Expense</h2>
          <ExpenseForm onSubmit={handleAdd} />
          {formError && <p className={styles.formError}>{formError}</p>}
        </section>

        <div className={styles.grid}>
          {/* Left: list + filters */}
          <div className={styles.listCol}>
            <FilterBar
              category={category} setCategory={setCategory}
              datePreset={datePreset} setDatePreset={setDatePreset}
              customStart={customStart} setCustomStart={setCustomStart}
              customEnd={customEnd} setCustomEnd={setCustomEnd}
              totalCount={expenses.length}
            />

            {loading && <p className={styles.status}>Loading…</p>}
            {error   && <p className={`${styles.status} ${styles.statusError}`}>Error: {error}</p>}

            {!loading && !error && (
              <ExpenseList
                expenses={expenses}
                onEdit={editExpense}
                onDelete={removeExpense}
              />
            )}
          </div>

          {/* Right: summary + chart */}
          <aside className={styles.sideCol}>
            <CategoryChart byCategory={summary?.byCategory} />
            <SummaryPanel
              summary={summary}
              budgets={budgets}
              onEditBudget={(cat, current) => setBudgetEdit({ category: cat, current })}
            />
          </aside>
        </div>
      </main>

      {budgetEdit && (
        <BudgetModal
          category={budgetEdit.category}
          current={budgetEdit.current}
          onSave={saveBudget}
          onClose={() => setBudgetEdit(null)}
        />
      )}
    </div>
  );
}
