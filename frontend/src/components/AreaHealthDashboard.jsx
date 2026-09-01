import React, { useState, useEffect } from 'react';
import { MapPin, Activity, AlertTriangle, Wind, ShieldCheck, Stethoscope, Users, Building2 } from 'lucide-react';
import { apiRequest } from '../utils/api';

export default function AreaHealthDashboard() {
  const [selectedArea, setSelectedArea] = useState('Civil Lines (Jhansi)');
  const [areaData, setAreaData] = useState(null);
  const [availableAreas, setAvailableAreas] = useState([
    'Civil Lines (Jhansi)',
    'Medical College Zone (Jhansi)',
    'SIPRI Bazar (Jhansi)',
    'Gwalior Road (Jhansi)'
  ]);
  const [loading, setLoading] = useState(true);

  const fetchAreaStats = async (areaName) => {
    setLoading(true);
    const res = await apiRequest(`/city/area-stats?area=${encodeURIComponent(areaName)}`);
    if (res.success) {
      setAreaData(res.area);
      if (res.availableAreas) setAvailableAreas(res.availableAreas);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAreaStats(selectedArea);
  }, [selectedArea]);

  return (
    <div className="space-y-6">
      {/* Area Selector Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-darkborder space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-darkborder pb-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30 text-xs font-semibold mb-2">
              <MapPin className="w-3.5 h-3.5 text-teal-400" />
              <span>Jhansi Locality Health Intelligence</span>
            </div>
            <h2 className="text-xl font-bold font-heading text-white">
              Area Health Statistics & Active Disease Trends (Jhansi, UP)
            </h2>
            <p className="text-xs text-slate-400">
              Real-time hospital capacity, active disease trends, air quality index (AQI), and OPD wait times across living localities in Jhansi, Uttar Pradesh.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-300 font-semibold">Select Jhansi Locality:</span>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="px-3.5 py-2 bg-darkbg border border-darkborder rounded-xl text-xs text-slate-200 font-bold focus:outline-none focus:border-teal-500"
            >
              {availableAreas.map((area) => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>
        </div>

        {loading || !areaData ? (
          <div className="p-8 text-center text-slate-400 text-sm">Loading Locality Statistics for Jhansi...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-darkbg border border-darkborder">
              <span className="text-xs text-slate-400 font-semibold">Locality Total Beds</span>
              <div className="text-2xl font-bold text-white mt-1">{areaData.totalBeds} Beds</div>
              <p className="text-[11px] text-emerald-400 font-medium">{areaData.availableBeds} Currently Free ({areaData.availableICUs} ICUs)</p>
            </div>

            <div className="p-4 rounded-xl bg-darkbg border border-darkborder">
              <span className="text-xs text-slate-400 font-semibold">Active Inflow Surge</span>
              <div className="text-2xl font-bold text-amber-400 mt-1">{areaData.activeSurgeFactor}</div>
              <p className="text-[11px] text-slate-500">Seasonal patient load status</p>
            </div>

            <div className="p-4 rounded-xl bg-darkbg border border-darkborder">
              <span className="text-xs text-slate-400 font-semibold">Locality AQI Index</span>
              <div className="text-2xl font-bold text-cyan-300 mt-1">{areaData.aqiLevel} AQI</div>
              <p className="text-[11px] text-emerald-400/80 font-medium">Moderate Air Quality</p>
            </div>

            <div className="p-4 rounded-xl bg-darkbg border border-darkborder">
              <span className="text-xs text-slate-400 font-semibold">Avg OPD Wait Time</span>
              <div className="text-2xl font-bold text-teal-400 mt-1">~{areaData.avgOpdWaitTimeMins} Mins</div>
              <p className="text-[11px] text-slate-500">Across local hospitals in Jhansi</p>
            </div>
          </div>
        )}
      </div>

      {/* Health Trends & Symptoms in Area */}
      {areaData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-darkborder space-y-4">
            <h3 className="text-lg font-bold font-heading text-white flex items-center space-x-2">
              <Activity className="w-5 h-5 text-rose-400" />
              <span>Dominant Active Symptoms Reported in {areaData.locality}</span>
            </h3>

            <div className="space-y-2.5">
              {areaData.dominantSymptoms.map((sym, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-darkbg border border-darkborder flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200 flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                    <span>{sym}</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    High Frequency
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-darkborder space-y-4">
            <h3 className="text-lg font-bold font-heading text-white flex items-center space-x-2">
              <Stethoscope className="w-5 h-5 text-teal-400" />
              <span>Top Medical Specialties in Demand ({areaData.locality})</span>
            </h3>

            <div className="space-y-2.5">
              {areaData.topSpecialtiesInDemand.map((spec, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-darkbg border border-darkborder flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200 flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                    <span>{spec} Department</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    Priority Doctors Active
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
