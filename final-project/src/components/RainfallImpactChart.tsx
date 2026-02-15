import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface RainfallImpactChartProps {
  waterSourceName: string;
}

const rainfallData = [
  { region: "North Galilee", impact: 42, color: "#3b82f6" },
  { region: "Golan Heights", impact: 28, color: "#10b981" },
  { region: "Jezreel Valley", impact: 15, color: "#f59e0b" },
  { region: "Haifa District", impact: 8, color: "#8b5cf6" },
  { region: "Central Israel", impact: 5, color: "#ec4899" },
  { region: "Southern Israel", impact: 2, color: "#6b7280" },
];

export function RainfallImpactChart({ waterSourceName }: RainfallImpactChartProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="mb-2">Rainfall Region Impact Analysis</h3>
      <p className="text-sm text-gray-600 mb-4">
        Contribution of each rainfall region to {waterSourceName} water level changes
      </p>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={rainfallData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" label={{ value: 'Impact (%)', position: 'insideBottom', offset: -1 }} />
          <YAxis dataKey="region" type="category" width={120} />
          <Tooltip />
          <Bar dataKey="impact" radius={[0, 8, 8, 0]}>
            {rainfallData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
        {rainfallData.slice(0, 3).map((region) => (
          <div key={region.region} className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: region.color }}></div>
              <p className="text-xs text-gray-600">{region.region}</p>
            </div>
            <p className="font-bold text-lg">{region.impact}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}
