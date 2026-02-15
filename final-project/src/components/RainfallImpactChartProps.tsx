import React from "react";

// interface RainfallImpactChartProps {
//   waterSourceName: string;
// }

// Example matrix data: regions × months (values = impact % contribution)
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const rainfallMatrix = [
  { region: "North Galilee", values: [45, 42, 38, 50, 48, 41] },
  { region: "Golan Heights", values: [30, 28, 25, 33, 29, 27] },
  { region: "Jezreel Valley", values: [18, 15, 14, 16, 15, 12] },
  { region: "Haifa District", values: [10, 8, 7, 9, 8, 6] },
  { region: "Central Israel", values: [6, 5, 4, 7, 6, 5] },
  { region: "Southern Israel", values: [3, 2, 2, 4, 3, 2] },
];

// simple color scale: low -> light, high -> blue
function getColor(value) {
  // clamp 0..100
  const v = Math.max(0, Math.min(100, value));
  // map to 0..1
  const t = v / 100;
  // interpolate between light gray and blue
  const r = Math.round(240 + (59 - 240) * t);
  const g = Math.round(240 + (130 - 240) * t);
  const b = Math.round(240 + (246 - 240) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

export function RainfallImpactChartProps({ waterSourceName }) {
  // compute global min/max if you want normalized scale (optional)
  const allValues = rainfallMatrix.flatMap((r) => r.values);
  const max = Math.max(...allValues);
  const min = Math.min(...allValues);

  return (
    <div className="bg-white rounded-lg shadow p-6">
       <div className="flex items-center justify-between mb-2">
        <h3 className="mb-2">Rainfall Region Heatmap</h3>
        <button className="px-2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <img src="./src/images/export.svg"></img>
        </button>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Monthly contribution of rainfall regions to {waterSourceName} water level changes
      </p>

      {/* header months */}
      <div className="overflow-x-auto">
        <div className="grid" style={{ gridTemplateColumns: `200px repeat(${months.length}, 1fr)` }}>
          <div className="p-2 text-sm font-medium">Region / Month</div>
          {months.map((m) => (
            <div key={m} className="p-2 text-sm font-medium text-center">
              {m}
            </div>
          ))}

          {/* rows */}
          {rainfallMatrix.map((row) => (
            <React.Fragment key={row.region}>
              <div className="p-2 text-sm font-medium border-t">{row.region}</div>
              {row.values.map((v, i) => (
                <div
                  key={i}
                  title={`${row.region} — ${months[i]}: ${v}%`}
                  className="p-1 border-t border-l"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: getColor((v - min) / (max - min) * 100),
                    color: v > (max - min) * 0.5 + min ? "#ffffff" : "#111827",
                  }}
                >
                  <span className="text-xs font-semibold">{v}</span>
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* legend */}
      <div className="mt-4 flex items-center gap-3 text-sm">
        <div className="w-48 h-4 rounded" style={{ background: "linear-gradient(90deg, rgb(240,240,240), rgb(59,130,246))" }} />
        <div className="text-xs text-gray-600">Low</div>
        <div className="text-xs text-gray-600">High</div>
      </div>
    </div>
  );
}
