import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

// Helper to get 'YYYY-MM' from a date string
function getMonth(dateStr) {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

// Group transactions by month and type
function getMonthlyData(transactions) {
  const monthly = {};
  transactions.forEach((t) => {
    const month = getMonth(t.date);
    if (!monthly[month]) monthly[month] = { month, income: 0, expense: 0 };
    if (t.type === "income") monthly[month].income += t.amount;
    if (t.type === "expense") monthly[month].expense += t.amount;
  });
  // Sort by month
  return Object.values(monthly).sort((a, b) => a.month.localeCompare(b.month));
}

export default function Analytics({ transactions }) {
  if (!transactions || transactions.length === 0) {
    return null; // Do not render if no transactions
  }

  // Pie Chart Data (Expenses by Category)
  const expenseByCategory = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const pieData = Object.entries(expenseByCategory).map(([category, amount]) => ({
    name: category,
    value: amount,
  }));

  const COLORS = [
    "#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#a4de6c",
    "#d0ed57", "#8dd1e1", "#ffb347", "#e9967a", "#b0e0e6"
  ];

  // Line Chart Data (Monthly Trends)
  const monthlyData = getMonthlyData(transactions);

  return (
    <div className="space-y-8">
      {/* Monthly Expense & Income Trends */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4 text-indigo-700">
          Monthly Expense & Income Trends
        </h3>
        {monthlyData.length === 0 ? (
          <div className="text-gray-500">No data to display.</div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#4ade80"
                name="Income"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="#f87171"
                name="Expense"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Expenses by Category Pie Chart */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4 text-indigo-700">
          Expenses by Category
        </h3>
        {pieData.length === 0 ? (
          <div className="text-gray-500">No expense data to display.</div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
