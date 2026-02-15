import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  { time: "00:00", visitors: 120, pageViews: 340 },
  { time: "04:00", visitors: 80, pageViews: 210 },
  { time: "08:00", visitors: 300, pageViews: 680 },
  { time: "12:00", visitors: 450, pageViews: 1020 },
  { time: "16:00", visitors: 380, pageViews: 890 },
  { time: "20:00", visitors: 280, pageViews: 620 },
];

export function LineChartComponent() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="mb-4">Website Traffic</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="visitors" stroke="#8b5cf6" strokeWidth={2} />
          <Line type="monotone" dataKey="pageViews" stroke="#f59e0b" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
