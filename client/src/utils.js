export const CATEGORIES = ['Food', 'Transport', 'Bills', 'Entertainment', 'Other'];

export const CATEGORY_COLORS = {
  Food:          'var(--cat-food)',
  Transport:     'var(--cat-transport)',
  Bills:         'var(--cat-bills)',
  Entertainment: 'var(--cat-entertainment)',
  Other:         'var(--cat-other)',
};

export const DATE_PRESETS = [
  { label: 'This month',  value: 'this_month' },
  { label: 'Last month',  value: 'last_month' },
  { label: 'Last 3 months', value: 'last_3_months' },
  { label: 'All time',    value: 'all' },
  { label: 'Custom',      value: 'custom' },
];

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr) {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  }).format(new Date(dateStr + 'T00:00:00'));
}

export function getDateRange(preset) {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();

  const pad = (n) => String(n).padStart(2, '0');
  const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  switch (preset) {
    case 'this_month': {
      const start = new Date(y, m, 1);
      const end   = new Date(y, m + 1, 0);
      return { startDate: iso(start), endDate: iso(end) };
    }
    case 'last_month': {
      const start = new Date(y, m - 1, 1);
      const end   = new Date(y, m, 0);
      return { startDate: iso(start), endDate: iso(end) };
    }
    case 'last_3_months': {
      const start = new Date(y, m - 2, 1);
      const end   = new Date(y, m + 1, 0);
      return { startDate: iso(start), endDate: iso(end) };
    }
    default:
      return {};
  }
}
