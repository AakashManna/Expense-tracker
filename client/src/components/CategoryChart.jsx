import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CATEGORIES, CATEGORY_COLORS, formatCurrency } from '../utils';
import styles from './CategoryChart.module.css';

export default function CategoryChart({ byCategory }) {
  const data = CATEGORIES
    .map((cat) => ({ name: cat, value: byCategory?.[cat] || 0 }))
    .filter((d) => d.value > 0);

  if (data.length === 0) {
    return (
      <div className={styles.empty}>No data for this period</div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const { name, value } = payload[0].payload;
    return (
      <div className={styles.tooltip}>
        <strong>{name}</strong>
        <span className="mono">{formatCurrency(value)}</span>
      </div>
    );
  };

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>This Month by Category</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span style={{ color: 'var(--text-sub)', fontSize: 12 }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
