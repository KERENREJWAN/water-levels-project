import { MapPin } from "lucide-react";

const regions = [
  { id: 1, name: "North America", revenue: "$1.2M", growth: "+12%", color: "bg-blue-500" },
  { id: 2, name: "Europe", revenue: "$890K", growth: "+8%", color: "bg-green-500" },
  { id: 3, name: "Asia Pacific", revenue: "$1.5M", growth: "+15%", color: "bg-purple-500" },
  { id: 4, name: "South America", revenue: "$450K", growth: "+5%", color: "bg-yellow-500" },
  { id: 5, name: "Africa & Middle East", revenue: "$320K", growth: "+18%", color: "bg-red-500" },
];

export function RegionalStats() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="mb-6">Regional Performance</h3>
      <div className="space-y-4">
        {regions.map((region) => (
          <div key={region.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-4 flex-1">
              <div className={`${region.color} p-2 rounded-lg`}>
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{region.name}</p>
                <p className="text-sm text-gray-600 mt-1">Revenue: {region.revenue}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-green-600 font-medium">{region.growth}</p>
              <p className="text-xs text-gray-500 mt-1">vs last quarter</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Total Global Revenue</p>
            <p className="text-2xl font-bold mt-1">$4.36M</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Avg. Growth Rate</p>
            <p className="text-2xl font-bold text-green-600 mt-1">+11.6%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
