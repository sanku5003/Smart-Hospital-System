import React, { useState, useEffect } from 'react';
import { Stethoscope, Search, Building2, MapPin, CheckCircle2, Bed, Clock, Phone, AlertCircle } from 'lucide-react';
import { apiRequest } from '../utils/api';

export default function SymptomHospitalFilter() {
  const [selectedSymptom, setSelectedSymptom] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);

  const predefinedSymptoms = [
    { label: 'Chest Pain / Heart Attack', value: 'chest pain' },
    { label: 'Bone Fracture / Joint Injury', value: 'fracture' },
    { label: 'Severe Breathing / Asthma', value: 'cough breathing' },
    { label: 'High Fever / Dengue / Viral', value: 'fever' },
    { label: 'Pregnancy / Labor Emergency', value: 'pregnant' },
    { label: 'Stroke / Head Injury', value: 'stroke head' }
  ];

  const fetchFilteredHospitals = async () => {
    setLoading(true);
    const res = await apiRequest(`/city/filter-by-symptoms?symptom=${encodeURIComponent(selectedSymptom)}&area=${encodeURIComponent(selectedArea)}`);
    if (res.success) {
      setHospitals(res.hospitals || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFilteredHospitals();
  }, [selectedSymptom, selectedArea]);

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="glass-panel p-6 rounded-2xl border border-darkborder space-y-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-semibold mb-2">
            <Stethoscope className="w-3.5 h-3.5 text-emerald-400" />
            <span>Symptom-Driven Hospital Finder</span>
          </div>
          <h2 className="text-xl font-bold font-heading text-white">
            Filter Medical Facilities & Hospitals According to Your Symptoms
          </h2>
          <p className="text-xs text-slate-400">
            Find nearby hospitals equipped with specialized departments, available beds, and active diagnostic scanners for your specific health condition.
          </p>
        </div>

        {/* Quick Symptom Chips */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300">Quick Symptom Selectors:</label>
          <div className="flex flex-wrap gap-2">
            {predefinedSymptoms.map((s) => (
              <button
                key={s.value}
                onClick={() => setSelectedSymptom(selectedSymptom === s.value ? '' : s.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                  selectedSymptom === s.value
                    ? 'bg-teal-500 text-darkbg border-teal-400 shadow-md shadow-teal-500/20'
                    : 'bg-darkbg text-slate-300 border-darkborder hover:border-slate-600'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Or Type Custom Symptom</label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Fracture, Severe Cough, Stroke..."
                value={selectedSymptom}
                onChange={(e) => setSelectedSymptom(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 bg-darkbg border border-darkborder rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Filter by Area / Locality</label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full px-3.5 py-2 bg-darkbg border border-darkborder rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-500"
            >
              <option value="">All Locality Areas</option>
              <option value="South Delhi">South Delhi</option>
              <option value="South East Delhi">South East Delhi</option>
              <option value="Central Delhi">Central Delhi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filtered Hospitals List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
          Matching Hospitals & Clinics ({hospitals.length})
        </h3>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Searching specialized hospitals...</div>
        ) : hospitals.length === 0 ? (
          <div className="glass-panel p-8 rounded-2xl text-center text-slate-400 text-sm">
            No matching medical facilities found for selected criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hospitals.map((hosp) => (
              <div key={hosp.hospitalId} className="glass-panel p-5 rounded-2xl border border-darkborder space-y-4 hover:border-teal-500/40 transition">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-white flex items-center space-x-1.5 font-heading">
                      <Building2 className="w-4 h-4 text-teal-400" />
                      <span>{hosp.name}</span>
                    </h4>
                    <p className="text-xs text-slate-400 flex items-center space-x-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span>{hosp.address} ({hosp.area})</span>
                    </p>
                  </div>
                </div>

                {/* Badges of Specialties */}
                <div className="flex flex-wrap gap-1">
                  {hosp.specialties.map((spec) => (
                    <span key={spec} className="px-2 py-0.5 text-[10px] font-semibold bg-darkbg text-teal-300 border border-darkborder rounded">
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Key Operational Indicators */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-darkborder/50 text-center text-xs">
                  <div className="bg-darkbg p-2 rounded-lg border border-darkborder">
                    <span className="text-[10px] text-slate-400 block">Free Beds</span>
                    <span className="font-bold text-emerald-400">{hosp.freeBeds}</span>
                  </div>
                  <div className="bg-darkbg p-2 rounded-lg border border-darkborder">
                    <span className="text-[10px] text-slate-400 block">Free ICU</span>
                    <span className="font-bold text-amber-400">{hosp.freeICU}</span>
                  </div>
                  <div className="bg-darkbg p-2 rounded-lg border border-darkborder">
                    <span className="text-[10px] text-slate-400 block">CT Wait</span>
                    <span className="font-bold text-cyan-300">{hosp.ctScanWaitMins}m</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
