import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  { category: "Product A", sales: 4000, target: 3500 },
  { category: "Product B", sales: 3000, target: 4000 },
  { category: "Product C", sales: 2000, target: 2500 },
  { category: "Product D", sales: 2780, target: 3000 },
  { category: "Product E", sales: 1890, target: 2000 },
  { category: "Product F", sales: 2390, target: 2200 },
];

export function BarChartComponent() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="mb-4">Product Performance</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="sales" fill="#10b981" />
          <Bar dataKey="target" fill="#6366f1" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
