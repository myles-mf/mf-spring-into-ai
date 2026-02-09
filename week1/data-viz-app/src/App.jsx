import { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

// Sample data: monthly values by category (you can replace with CSV/API later)
const ALL_DATA = [
  { month: 'Jan', value: 42, category: 'A' },
  { month: 'Feb', value: 38, category: 'A' },
  { month: 'Mar', value: 55, category: 'A' },
  { month: 'Apr', value: 61, category: 'B' },
  { month: 'May', value: 48, category: 'B' },
  { month: 'Jun', value: 72, category: 'B' },
  { month: 'Jul', value: 65, category: 'B' },
  { month: 'Aug', value: 58, category: 'A' },
  { month: 'Sep', value: 71, category: 'A' },
  { month: 'Oct', value: 80, category: 'A' },
  { month: 'Nov', value: 66, category: 'B' },
  { month: 'Dec', value: 90, category: 'B' },
]

const CATEGORIES = ['All', 'A', 'B']

export default function App() {
  const [category, setCategory] = useState('All')

  const data =
    category === 'All'
      ? ALL_DATA
      : ALL_DATA.filter((d) => d.category === category)

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <h1 style={{ marginBottom: '0.25rem' }}>ChartSlice</h1>
      <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
        Interactive bar chart — slice the data by category and explore.
      </p>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="filter" style={{ marginRight: '0.5rem' }}>
          Filter by category:
        </label>
        <select
          id="filter"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            padding: '0.35rem 0.75rem',
            fontSize: '1rem',
            borderRadius: 6,
            border: '1px solid #475569',
            background: '#1e293b',
            color: '#e2e8f0',
          }}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <ResponsiveContainer width="100%" height={360}>
        <BarChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
          <XAxis dataKey="month" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip
            contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: 8 }}
            labelStyle={{ color: '#e2e8f0' }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.category === 'A' ? '#38bdf8' : '#a78bfa'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
