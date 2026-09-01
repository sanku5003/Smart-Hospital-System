import React, { useState, useEffect } from 'react';
import { MapPin, Building2, Bed, Activity, Phone, ShieldCheck, Ambulance, AlertTriangle } from 'lucide-react';
import { apiRequest } from '../utils/api';

export default function CityMap({ onOpenAmbulanceModal, onOpenDisasterModal }) {
  const [cityData, setCityData] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCityFeed = async () => {
    setLoading(true);
    const res = await apiRequest('/city/feed');
    if (res.success) {
      setCityData(res);
      if (res.hospitals && res.hospitals.length > 0) {
        setSelectedHospital(res.hospitals[0]);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCityFeed();
  }, []);

  return (
    <div className="space-y-6">
      {/* City Summary Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-darkborder bg-gradient-to-r from-darkcard via-slate-900 to-darkcard space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-darkborder pb-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-semibold mb-2">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>Jhansi City Health Network (Uttar Pradesh)</span>
            </div>
            <h2 className="text-xl font-bold font-heading text-white">
              Centralized Jhansi Hospital Capacity & Bed Availability Stream
            </h2>
            <p className="text-xs text-slate-400">
              Aggregated real-time stream covering MLB Medical College, District Hospital, St. Jude's, Nirmal Trauma Center, and Sudha Heart Institute in Jhansi, UP.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenAmbulanceModal}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-darkbg font-bold rounded-xl text-xs flex items-center space-x-1.5 transition shadow-lg shadow-emerald-500/20"
            >
              <Ambulance className="w-4 h-4" />
              <span>Jhansi 108 Ambulance Reserve</span>
            </button>
            <button
              onClick={onOpenDisasterModal}
              className="px-4 py-2 bg-rose-500 hover:bg-rose-400 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 transition shadow-lg shadow-rose-500/20"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Disaster Surge Protocol</span>
            </button>
          </div>
        </div>

        {cityData?.summary && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-xl bg-darkbg border border-darkborder">
              <span className="text-xs text-slate-400 font-semibold">Jhansi Hospitals</span>
              <div className="text-xl font-bold text-white mt-0.5">{cityData.summary.totalHospitals} Facilities</div>
            </div>
            <div className="p-3.5 rounded-xl bg-darkbg border border-darkborder">
              <span className="text-xs text-emerald-400 font-semibold">City Free Beds</span>
              <div className="text-xl font-bold text-emerald-300 mt-0.5">{cityData.summary.totalFreeBeds} Beds</div>
            </div>
            <div className="p-3.5 rounded-xl bg-darkbg border border-darkborder">
              <span className="text-xs text-amber-400 font-semibold">City Free ICUs</span>
              <div className="text-xl font-bold text-amber-300 mt-0.5">{cityData.summary.totalFreeICU} ICUs</div>
            </div>
            <div className="p-3.5 rounded-xl bg-darkbg border border-darkborder">
              <span className="text-xs text-cyan-400 font-semibold">Free Ventilators</span>
              <div className="text-xl font-bold text-cyan-300 mt-0.5">{cityData.summary.totalFreeVentilators} Units</div>
            </div>
          </div>
        )}
      </div>

      {/* Hospital List & Details Interactive View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Hospitals Directory List */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">
            Connected Jhansi Hospitals ({cityData?.hospitals?.length || 0})
          </h3>

          {loading ? (
            <div className="p-6 text-center text-slate-400 text-sm">Loading Jhansi Stream...</div>
          ) : (
            cityData?.hospitals?.map((hosp) => (
              <div
                key={hosp.hospitalId}
                onClick={() => setSelectedHospital(hosp)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedHospital?.hospitalId === hosp.hospitalId
                    ? 'bg-teal-500/10 border-teal-500/50 shadow-lg shadow-teal-500/10'
                    : 'bg-darkcard border-darkborder hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-white flex items-center space-x-1.5">
                      <Building2 className="w-4 h-4 text-teal-400" />
                      <span>{hosp.name}</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">{hosp.address}</p>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {hosp.freeBeds} Beds Free
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-darkborder/50 text-center text-xs">
                  <div className="bg-darkbg p-1.5 rounded border border-darkborder">
                    <span className="text-[10px] text-slate-400 block">Free ICU</span>
                    <span className="font-bold text-amber-400">{hosp.freeICU}</span>
                  </div>
                  <div className="bg-darkbg p-1.5 rounded border border-darkborder">
                    <span className="text-[10px] text-slate-400 block">OPD Wait</span>
                    <span className="font-bold text-teal-300">{hosp.opdAvgWaitMins}m</span>
                  </div>
                  <div className="bg-darkbg p-1.5 rounded border border-darkborder">
                    <span className="text-[10px] text-slate-400 block">CT Wait</span>
                    <span className="font-bold text-cyan-300">{hosp.ctScanWaitMins}m</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Hospital Inspector */}
        <div className="lg:col-span-7 space-y-6">
          {selectedHospital ? (
            <div className="glass-panel p-6 rounded-2xl border border-darkborder space-y-5">
              <div className="flex items-start justify-between border-b border-darkborder pb-4">
                <div>
                  <span className="text-xs text-teal-400 font-bold uppercase tracking-wider">Hospital Detail Stream</span>
                  <h3 className="text-2xl font-bold font-heading text-white mt-1">{selectedHospital.name}</h3>
                  <p className="text-xs text-slate-400 flex items-center space-x-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{selectedHospital.address}</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Contact Desk</span>
                  <span className="text-xs font-bold text-emerald-400">{selectedHospital.phone}</span>
                </div>
              </div>

              {/* Detailed Live Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-darkbg border border-darkborder">
                  <span className="text-xs text-slate-400">Total Bed Capacity</span>
                  <div className="text-lg font-bold text-white mt-1">{selectedHospital.totalBeds} Beds</div>
                </div>
                <div className="p-3.5 rounded-xl bg-darkbg border border-darkborder">
                  <span className="text-xs text-emerald-400">Available Beds</span>
                  <div className="text-lg font-bold text-emerald-300 mt-1">{selectedHospital.freeBeds} Free</div>
                </div>
                <div className="p-3.5 rounded-xl bg-darkbg border border-darkborder">
                  <span className="text-xs text-amber-400">ICU Capacity</span>
                  <div className="text-lg font-bold text-amber-300 mt-1">{selectedHospital.freeICU} Free</div>
                </div>
                <div className="p-3.5 rounded-xl bg-darkbg border border-darkborder">
                  <span className="text-xs text-cyan-400">CT Scan Queue</span>
                  <div className="text-lg font-bold text-cyan-300 mt-1">~{selectedHospital.ctScanWaitMins} mins</div>
                </div>
                <div className="p-3.5 rounded-xl bg-darkbg border border-darkborder">
                  <span className="text-xs text-slate-400">MRI Queue</span>
                  <div className="text-lg font-bold text-slate-200 mt-1">~{selectedHospital.mriWaitMins} mins</div>
                </div>
                <div className="p-3.5 rounded-xl bg-darkbg border border-darkborder">
                  <span className="text-xs text-slate-400">Blood Bank Reserve</span>
                  <div className="text-lg font-bold text-teal-300 mt-1">{selectedHospital.bloodBankStatus}</div>
                </div>
              </div>

              {/* Quick Action Button */}
              <div className="pt-2">
                <button
                  onClick={onOpenAmbulanceModal}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-darkbg font-bold rounded-xl text-xs transition flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20"
                >
                  <Ambulance className="w-4 h-4" />
                  <span>Reserve Emergency Bed at {selectedHospital.name}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-8 rounded-2xl border border-darkborder text-center text-slate-400 text-sm">
              Select a hospital from the list to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
