import { useState } from "react";
import { Droplets, BarChart3, Map, MessageSquare } from "lucide-react";
import { WaterSourceCard } from "./components/WaterSourceCard";
import { PredictionChart } from "./components/PredictionChart";
import { RainfallImpactChart } from "./components/RainfallImpactChart";
import { IsraelWaterMap } from "./components/IsraelWaterMap";
import { WaterChatbot } from "./components/WaterChatbot";
import { RainfallImpactChartProps } from "./components/RainfallImpactChartProps";
import { DailyChangeChart } from "./components/DailyChangeChart";
import { PredictionVsActualChart } from "./components/PerdictionVsActualChart";

export default function App() {
  const [activeTab, setActiveTab] = useState<"overview" | "predictions" | "map" | "chatbot">("overview");

  const waterSources = [
    {
      name: "Kinneret",
      currentLevel: -210.0,
      maxCapacity: -208.8,
      prediction1Week: -209.8,
      prediction2Week: -209.5,
      prediction1Month: -209.2,
      trend: "up" as const,
      status: "good" as const,
    },
    {
      name: "Kishon River",
      currentLevel: 18.5,
      maxCapacity: 25.0,
      prediction1Week: 18.7,
      prediction2Week: 19.0,
      prediction1Month: 19.5,
      trend: "up" as const,
      status: "warning" as const,
    },
    {
      name: "Yarkon River",
      currentLevel: 42.0,
      maxCapacity: 50.0,
      prediction1Week: 42.3,
      prediction2Week: 42.5,
      prediction1Month: 43.0,
      trend: "up" as const,
      status: "good" as const,
    },
    {
      name: "Dead Sea",
      currentLevel: -438.0,
      maxCapacity: -430.0,
      prediction1Week: -438.1,
      prediction2Week: -438.3,
      prediction1Month: -438.5,
      trend: "down" as const,
      status: "critical" as const,
    },
  ];

  const tabs = [
    { id: "overview" as const, label: "Overview", icon: Droplets },
    { id: "predictions" as const, label: "Predictions & Analysis", icon: BarChart3 },
    { id: "map" as const, label: "Geographic Map", icon: Map },
    { id: "chatbot" as const, label: "AI Assistant", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white shadow-md border-b-2 border-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-lg">
              <Droplets className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1>Water Vision</h1>
              <p className="text-gray-600 mt-1">
                ML-Powered Water Level Prediction & Monitoring Platform
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mt-6 border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600 font-medium"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Data Collection Status */}
            {/* <DataCollectionStatus /> */}

            {/* Water Sources Cards */}
            <div>
              <h2 className="mb-4">Current Water Sources Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {waterSources.map((source) => (
                  <WaterSourceCard key={source.name} {...source} />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "predictions" && (
          <div className="space-y-8">
            {/* Prediction Charts */}
            <PredictionChart waterSourceName="Kinneret" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RainfallImpactChart waterSourceName="Kinneret" />
              <RainfallImpactChartProps waterSourceName="Kinneret" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DailyChangeChart />
              <PredictionVsActualChart />
            </div>
          </div>
        )}

        {activeTab === "map" && (
          <div className="space-y-8">
            <IsraelWaterMap />

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="mb-4">Map Legend & Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Water Source Indicators</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span>Green: Good status (&gt;80% capacity)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span>Yellow: Warning (50-80% capacity)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span>Red: Critical (&lt;50% capacity)</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Rainfall Region Heatmap</h4>
                  <p className="text-sm text-gray-600">
                    Colored regions indicate rainfall intensity levels. Darker blue
                    areas represent higher rainfall amounts that contribute more
                    significantly to water source replenishment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "chatbot" && (
          <div className="space-y-8">
            <WaterChatbot />

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="mb-3">About the AI Assistant</h3>
              <p className="text-sm text-gray-600 mb-4">
                Our AI-powered chatbot provides instant access to water level data, predictions, and analysis. It retrieves real-time information from our database and ML prediction models.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">What you can ask:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Current water levels and predictions</li>
                    <li>• Rainfall impact analysis</li>
                    <li>• Trend analysis and forecasts</li>
                    <li>• Historical comparisons</li>
                  </ul>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Data Sources:</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Real-time monitoring systems</li>
                    <li>• ML prediction models (v2.3.1)</li>
                    <li>• Historical database (10+ years)</li>
                    <li>• Rainfall measurement networks</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
