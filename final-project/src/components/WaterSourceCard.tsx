import { Droplet, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface WaterSourceCardProps {
  name: string;
  currentLevel: number;
  maxCapacity: number;
  prediction1Week: number;
  prediction2Week: number;
  prediction1Month: number;
  trend: "up" | "down" | "stable";
  status: "good" | "warning" | "critical";
}

export function WaterSourceCard({
  name,
  currentLevel,
  maxCapacity,
  prediction1Week,
  prediction2Week,
  prediction1Month,
  trend,
  status,
}: WaterSourceCardProps) {
  const percentage = (currentLevel / maxCapacity) * 100;
  
  const statusColors = {
    good: "bg-green-100 border-green-500 text-green-700",
    warning: "bg-yellow-100 border-yellow-500 text-yellow-700",
    critical: "bg-red-100 border-red-500 text-red-700",
  };

  const statusBars = {
    good: "bg-green-500",
    warning: "bg-yellow-500",
    critical: "bg-red-500",
  };

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  return (
    <div className={`rounded-lg border-l-4 p-6 ${statusColors[status]} bg-white shadow`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-gray-900">{name}</h3>
          <p className="text-sm text-gray-600 mt-1">
            {currentLevel.toFixed(1)}m / {maxCapacity}m ({percentage.toFixed(1)}%)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Droplet className={`w-5 h-5 ${status === 'good' ? 'text-green-600' : status === 'warning' ? 'text-yellow-600' : 'text-red-600'}`} />
          <TrendIcon className="w-5 h-5 text-gray-600" />
        </div>
      </div>

      {/* Level Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
        <div
          className={`h-3 rounded-full ${statusBars[status]} transition-all duration-500`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>

      {/* Predictions */}
      <div className="grid grid-cols-3 gap-3 text-sm">
        <div className="text-center p-2 bg-gray-50 rounded">
          <p className="text-gray-600 text-xs">1 Week</p>
          <p className="font-medium mt-1">{prediction1Week.toFixed(1)}m</p>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded">
          <p className="text-gray-600 text-xs">2 Weeks</p>
          <p className="font-medium mt-1">{prediction2Week.toFixed(1)}m</p>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded">
          <p className="text-gray-600 text-xs">1 Month</p>
          <p className="font-medium mt-1">{prediction1Month.toFixed(1)}m</p>
        </div>
      </div>
    </div>
  );
}
