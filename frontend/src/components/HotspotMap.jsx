import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from 'react-leaflet';
import { MapPin, AlertTriangle, Users, Layers } from 'lucide-react';

export default function HotspotMap({ hotspots = [], onSelectHotspot }) {
  const [mapError, setMapError] = useState(false);

  // Default center of India
  const position = [20.5937, 78.9629];
  const zoom = 5;

  const getColor = (priority) => {
    if (priority >= 80) return '#f43f5e'; // Rose / High
    if (priority >= 60) return '#f59e0b'; // Amber / Medium
    return '#10b981'; // Emerald / Low
  };

  return (
    <div className="relative w-full h-[520px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
      
      {/* Map Legend Overlay */}
      <div className="absolute top-4 right-4 z-[1000] bg-slate-900/90 backdrop-blur-md border border-slate-800 p-3 rounded-xl shadow-lg text-xs space-y-2">
        <p className="font-semibold text-slate-200 border-b border-slate-800 pb-1 flex items-center space-x-1">
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          <span>Priority Levels</span>
        </p>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm shadow-rose-500"></span>
          <span className="text-slate-300">High Priority (&ge; 80)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500"></span>
          <span className="text-slate-300">Medium Priority (60 - 79)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500"></span>
          <span className="text-slate-300">Low Priority (&lt; 60)</span>
        </div>
      </div>

      {!mapError ? (
        <MapContainer
          center={position}
          zoom={zoom}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%', background: '#090d16' }}
          whenCreated={(mapInstance) => {
            mapInstance.on('tileerror', () => setMapError(true));
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {hotspots.map((item, index) => {
            const radius = Math.min(25, Math.max(10, item.request_count * 2.5));
            const color = getColor(item.average_priority);

            return (
              <CircleMarker
                key={index}
                center={[item.lat, item.lng]}
                radius={radius}
                pathOptions={{
                  fillColor: color,
                  fillOpacity: 0.6,
                  color: color,
                  weight: 2
                }}
              >
                <Tooltip direction="top" offset={[0, -10]} opacity={0.95}>
                  <div className="text-slate-900 font-sans p-1">
                    <p className="font-bold text-xs">{item.district}, {item.state}</p>
                    <p className="text-[11px] font-semibold text-amber-700">{item.category}</p>
                    <p className="text-[10px]">Avg Priority: <strong>{item.average_priority}</strong></p>
                  </div>
                </Tooltip>
                
                <Popup>
                  <div className="p-2 text-slate-900 text-xs">
                    <h4 className="font-bold text-sm text-slate-900 font-outfit">{item.district}, {item.state}</h4>
                    <p className="text-amber-800 font-semibold mt-0.5">{item.category} Hotspot</p>
                    
                    <div className="mt-2 space-y-1 text-[11px] border-t border-slate-200 pt-1.5">
                      <p>Citizen Requests: <strong>{item.request_count}</strong></p>
                      <p>Avg AI Priority Score: <strong>{item.average_priority}/100</strong></p>
                      <p>Estimated Affected Pop: <strong>{item.estimated_affected_population?.toLocaleString()}</strong></p>
                    </div>

                    {onSelectHotspot && (
                      <button
                        onClick={() => onSelectHotspot(item)}
                        className="mt-3 w-full bg-slate-900 text-white font-medium py-1.5 rounded-md hover:bg-slate-800 transition-colors text-[11px]"
                      >
                        Generate Policy Brief
                      </button>
                    )}
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      ) : (
        /* Standalone India Map Fallback */
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 p-6 text-center">
          <AlertTriangle className="w-10 h-10 text-amber-400 mb-3" />
          <h3 className="text-lg font-bold text-slate-200 font-outfit">Interactive Regional Hotspot View</h3>
          <p className="text-xs text-slate-400 max-w-md mt-1">
            Displaying India district development hotspots directly from the SQLite intelligence database.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 w-full max-w-4xl mt-6 max-h-72 overflow-y-auto pr-2">
            {hotspots.map((item, idx) => (
              <div
                key={idx}
                onClick={() => onSelectHotspot && onSelectHotspot(item)}
                className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl text-left hover:border-amber-500/50 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-200">{item.district}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    item.average_priority >= 80 ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {item.average_priority}
                  </span>
                </div>
                <p className="text-[11px] text-amber-400 font-medium mt-1">{item.category}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                  <span>{item.request_count} Requests</span>
                  <span>Pop: {item.estimated_affected_population?.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
