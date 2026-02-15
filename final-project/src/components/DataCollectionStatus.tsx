import { Database, Cloud, TrendingUp, RefreshCw } from "lucide-react";

export function DataCollectionStatus() {
  const dataLayers = [
    {
      name: "Water Level Data",
      lastUpdate: "Dec 26, 2024",
      status: "active",
      sources: 15,
      icon: Database,
    },
    {
      name: "Precipitation Data",
      lastUpdate: "Dec 25, 2024",
      status: "active",
      sources: 42,
      icon: Cloud,
    },
    {
      name: "Climate Data",
      lastUpdate: "Dec 24, 2024",
      status: "active",
      sources: 28,
      icon: TrendingUp,
    },
    {
      name: "ML Model Training",
      lastUpdate: "Dec 1, 2024",
      status: "scheduled",
      sources: 1,
      icon: RefreshCw,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="mb-4">Data Collection & ML Pipeline Status</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dataLayers.map((layer) => {
          const Icon = layer.icon;
          return (
            <div key={layer.name} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <Icon className="w-5 h-5 text-blue-600" />
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    layer.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {layer.status}
                </span>
              </div>
              <h4 className="text-sm font-medium mb-1">{layer.name}</h4>
              <p className="text-xs text-gray-600 mb-2">
                {layer.sources} data sources
              </p>
              <p className="text-xs text-gray-500">
                Updated: {layer.lastUpdate}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start gap-3">
          <RefreshCw className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">
              Continuous Learning Pipeline
            </h4>
            <p className="text-sm text-blue-800">
              Next model retraining scheduled for: <strong>January 1, 2025</strong>
            </p>
            <p className="text-xs text-blue-700 mt-2">
              The system performs monthly retraining with new data to improve prediction accuracy.
              Current model accuracy: 94.2%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
