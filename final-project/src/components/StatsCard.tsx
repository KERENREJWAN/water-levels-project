import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  trend: "up" | "down";
}

export function StatsCard({ title, value, change, icon: Icon, trend }: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600">{title}</p>
          <h3 className="mt-2">{value}</h3>
          <p className={`text-sm mt-2 ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
            {trend === "up" ? "↑" : "↓"} {change}
          </p>
        </div>
        <div className={`rounded-full p-3 ${trend === "up" ? "bg-green-100" : "bg-red-100"}`}>
          <Icon className={`w-6 h-6 ${trend === "up" ? "text-green-600" : "text-red-600"}`} />
        </div>
      </div>
    </div>
  );
}
