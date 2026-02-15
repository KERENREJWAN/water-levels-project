import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";

interface PredictionChartProps {
  waterSourceName: string;
}

// Mock historical and prediction data
const generateData = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const data = [];
  
  // Historical data (12 months)
  for (let i = 0; i < 12; i++) {
    data.push({
      month: months[i],
      actual: -210 + Math.random() * 5 + (i * 0.3),
      isHistorical: true,
    });
  }
  
  // Future predictions
  const lastActual = data[data.length - 1].actual;
  data.push(
    { month: "Week 1", predicted1Week: lastActual + 0.2, isHistorical: false },
    { month: "Week 2", predicted2Week: lastActual + 0.5, isHistorical: false },
    { month: "Month 1", predicted1Month: lastActual + 0.8, isHistorical: false }
  );
  
  return data;
};

export function PredictionChart({ waterSourceName }: PredictionChartProps) {
  const data = generateData();

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="mb-4">{waterSourceName} - Water Level Forecast</h3>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis label={{ value: 'Water Level (m)', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <ReferenceLine x="Dec" stroke="#666" strokeDasharray="3 3" label="Current" />
          <Line 
            type="monotone" 
            dataKey="actual" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ fill: '#3b82f6' }}
            name="Historical Data"
          />
          <Line 
            type="monotone" 
            dataKey="predicted1Week" 
            stroke="#10b981" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: '#10b981' }}
            name="1 Week Forecast"
          />
          <Line 
            type="monotone" 
            dataKey="predicted2Week" 
            stroke="#f59e0b" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: '#f59e0b' }}
            name="2 Week Forecast"
          />
          <Line 
            type="monotone" 
            dataKey="predicted1Month" 
            stroke="#ef4444" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: '#ef4444' }}
            name="1 Month Forecast"
          />
        </LineChart>
      </ResponsiveContainer>
      
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>ML Model Info:</strong> Last updated: Dec 2024 | Accuracy: 94.2% | Model version: v2.3.1
        </p>
      </div>
    </div>
  );
}
