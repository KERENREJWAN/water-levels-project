import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

type Point = { date: string; change: number };

function makeDemoData(days = 30): Point[] {
  const out: Point[] = [];
  let value = 0;
    // start from the beginning of the current month
  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);

  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const date = `${d.getDate()}/${d.getMonth() + 1}`;
    // demo random small daily rate (percent or meters) - replace with real
    const change = parseFloat((Math.random() * 0.6 - 0.3).toFixed(2));
    out.push({ date, change });
    value += change;
  }
  return out;
}

export function DailyChangeChart({ data, title = "Daily Change (previous month)" }: { data?: Point[]; title?: string }) {
    const chartData = data ?? makeDemoData(30);

    return (
        <div className="bg-white rounded-lg shadow p-4">
            <h4 className="mb-2 text-sm font-medium">{title}</h4>
            <div style={{ width: "100%", height: 220 }}>
                <ResponsiveContainer>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" minTickGap={10} />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="change" stroke="#3b82f6" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}