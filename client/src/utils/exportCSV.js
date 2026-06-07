export function exportToCSV(expenses) {
  const headers = ['Date', 'Category', 'Amount (INR)', 'Note'];
  const rows = expenses.map((e) => [
    e.date,
    e.category,
    e.amount,
    `"${(e.note || '').replace(/"/g, '""')}"`,
  ]);

  const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `expenses-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
