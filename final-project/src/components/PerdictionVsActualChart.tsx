import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

type Point = { date: string; actual: number; predicted: number };

function makeDemoData(days = 30): Point[] {
  const out: Point[] = [];
  let actual = 100; // base

  // start from the beginning of the current month
  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);

  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const date = `${d.getDate()}/${d.getMonth() + 1}`;
    // demo actual and predicted with small deviations
    const daily = (Math.random() * 1.2);
    actual = parseFloat((actual + daily).toFixed(2));
    const predicted = parseFloat((actual + (Math.random() * 10)).toFixed(2));
    out.push({ date, actual, predicted });
  }
  return out;
}

export function PredictionVsActualChart({ data, title = "Predicted vs Actual (previous month)" }: { data?: Point[]; title?: string }) {
  const chartData = data ?? makeDemoData(30);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-2">
          <h3>{title}</h3>
          <button className="px-2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <img src="./src/images/export.svg"></img>
          </button>
        </div>
      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" minTickGap={10} />
            <YAxis />
            <Tooltip />
            <Legend verticalAlign="top" height={24} />
            <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} dot={false} name="Actual" />
            <Line type="monotone" dataKey="predicted" stroke="#ef4444" strokeWidth={2} dot={false} strokeDasharray="4 4" name="Predicted" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}