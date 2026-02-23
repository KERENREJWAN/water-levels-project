import React, { useEffect } from "react";
import { MapPin } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Circle,
  Tooltip as LeafletTooltip,
  useMap,
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";

// ...existing data but now include real lat/lng for markers
const waterSources = [
  // real lat/lng coordinates added
  { id: 1, name: "Kinneret", lat: 32.724, lng: 35.5658, status: "good", level: 98 },
  { id: 4, name: "Yarkon River", lat: 32.080, lng: 34.812, status: "warning", level: 68 },
  { id: 5, name: "Kishon River", lat: 32.720, lng: 35.000, status: "good", level: 91 },
  { id: 6, name: "Dead Sea", lat: 31.559, lng: 35.473, status: "critical", level: 45 },
];

const rainfallRegions = [
  // keep region percent data (or replace with real lat/lng if you have them)
  { id: 1, name: "North Galilee", x: 48, y: 15, width: 25, height: 20, intensity: 85 },
  { id: 2, name: "Golan Heights", x: 60, y: 20, width: 20, height: 25, intensity: 72 },
  { id: 3, name: "Central", x: 30, y: 45, width: 30, height: 25, intensity: 45 },
  { id: 4, name: "Southern", x: 25, y: 75, width: 35, height: 20, intensity: 20 },
];

export function IsraelWaterMap() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "#10b981";
      case "warning":
        return "#f59e0b";
      case "critical":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity > 70) return "rgba(59, 130, 246, 0.3)";
    if (intensity > 40) return "rgba(59, 130, 246, 0.2)";
    return "rgba(59, 130, 246, 0.1)";
  };

  // approximate Israel bounding box (still used if converting pct -> lat/lng)
  const bounds = {
    north: 33.3,
    south: 29.45,
    west: 34.27,
    east: 35.9,
  };

  const pctToLatLng = (x: number, y: number): [number, number] => {
    const lon = bounds.west + (x / 100) * (bounds.east - bounds.west);
    const lat = bounds.north - (y / 100) * (bounds.north - bounds.south);
    return [lat, lon];
  };

  const center: LatLngExpression = [31.5, 34.9];

  // Imperative marker adder using L.marker and addTo(map)
  function AddMarkers() {
    const map = useMap();

    useEffect(() => {
      if (!map) return;

      const created: L.Marker[] = waterSources.map((s) => {
        // custom simple circle icon using divIcon to match status color
        const html = `<span style="
            display:block;
            width:14px;
            height:14px;
            background:${getStatusColor(s.status)};
            border:2px solid white;
            border-radius:50%;
            box-shadow:0 0 2px rgba(0,0,0,0.3);
          "></span>`;

        const icon = L.divIcon({
          className: "custom-map-marker",
          html,
          iconSize: [18, 18],
          iconAnchor: [9, 9], // center
        });

        const marker = L.marker([s.lat, s.lng], { icon })
          .bindPopup(
            `<div style="font-size:13px">
              <strong>${s.name}</strong><br/>
              Level: ${s.level}%<br/>
              Status: ${s.status}
            </div>`
          )
          .addTo(map);

        return marker;
      });

      // cleanup on unmount
      return () => {
        created.forEach((m) => {
          try {
            map.removeLayer(m);
          } catch {}
        });
      };
    }, [map]);

    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="mb-4">Israel Water Sources & Rainfall Regions</h3>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Map */}
        <div className="flex-1">
          <div className="relative w-full aspect-[3/4] rounded-lg border-2 border-gray-300 overflow-hidden">
            <MapContainer center={center} zoom={8} style={{ width: "100%", height: "100%" }} scrollWheelZoom={true}>
              <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              {/* Imperatively add L.marker markers with addTo(map) */}
              <AddMarkers />

              {/* If you still want rainfall regions as circles, convert pct -> lat/lng here */}
              {rainfallRegions.map((region) => {
                const [lat, lon] = pctToLatLng(region.x, region.y);
                const radius = (Math.max(region.width, region.height) / 100) * 60000;
                return (
                  <Circle
                    key={region.id}
                    center={[lat, lon]}
                    radius={radius}
                    pathOptions={{
                      color: "rgba(59,130,246,0.6)",
                      fillColor: getIntensityColor(region.intensity),
                      fillOpacity: 0.5,
                      weight: 1,
                    }}
                  >
                    <LeafletTooltip>{region.name}: {region.intensity}%</LeafletTooltip>
                  </Circle>
                );
              })}
            </MapContainer>
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Good (&gt;80%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>Warning (50-80%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Critical (&lt;50%)</span>
            </div>
          </div>
        </div>

        {/* Water Sources List */}
        <div className="lg:w-80">
          <h4 className="font-medium mb-3">Water Sources Status</h4>
          <div className="space-y-2">
            {waterSources.map((source) => (
              <div key={source.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4" style={{ color: getStatusColor(source.status) }} />
                  <div>
                    <p className="text-sm font-medium">{source.name}</p>
                    <p className="text-xs text-gray-600">{source.level}% capacity</p>
                  </div>
                </div>
                <div className="w-12 bg-gray-200 rounded-full h-2">
                  <div className="h-2 rounded-full transition-all" style={{ width: `${source.level}%`, backgroundColor: getStatusColor(source.status) }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}