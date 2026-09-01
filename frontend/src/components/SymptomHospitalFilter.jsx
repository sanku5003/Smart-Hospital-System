import React, { useState, useEffect } from 'react';
import { Stethoscope, Search, Building2, MapPin, CheckCircle2, Bed, Clock, Phone, AlertCircle, Calendar, UserCheck, User } from 'lucide-react';
import { apiRequest } from '../utils/api';

export default function SymptomHospitalFilter() {
  const [doctorNameInput, setDoctorNameInput] = useState('');
  const [specialistTypeInput, setSpecialistTypeInput] = useState('');
  const [selectedSymptom, setSelectedSymptom] = useState('chest pain');
  const [selectedArea, setSelectedArea] = useState('');

  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  const predefinedSpecialists = [
    { label: '🫀 Cardiologist', value: 'Cardiologist' },
    { label: '🦴 Orthopedic Surgeon', value: 'Orthopedic' },
    { label: '🫁 Pulmonologist', value: 'Pulmonologist' },
    { label: '🚨 Emergency / Trauma', value: 'Emergency' },
    { label: '🩺 General Physician', value: 'General Physician' }
  ];

  const fetchFilteredHospitals = async () => {
    setLoading(true);
    const query = `/city/filter-by-symptoms?doctorName=${encodeURIComponent(doctorNameInput)}&specialistType=${encodeURIComponent(specialistTypeInput)}&symptom=${encodeURIComponent(selectedSymptom)}&area=${encodeURIComponent(selectedArea)}`;
    const res = await apiRequest(query);
    if (res.success) {
      setHospitals(res.hospitals || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFilteredHospitals();
  }, [doctorNameInput, specialistTypeInput, selectedSymptom, selectedArea]);

  const handleBookDoctorToken = (docName, hospitalName, timing, room) => {
    setBookingSuccess(`Token Reserved with ${docName} at ${hospitalName}! Shift Hours: ${timing} (${room})`);
    setTimeout(() => setBookingSuccess(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Multi-Column Search Controls */}
      <div className="glass-panel p-6 rounded-2xl border border-darkborder space-y-5">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30 text-xs font-semibold mb-2">
            <Stethoscope className="w-3.5 h-3.5 text-teal-400" />
            <span>Jhansi Doctor & Specialist Direct Consultation Finder</span>
          </div>
          <h2 className="text-xl font-bold font-heading text-white">
            Search Doctors & Specialists in Jhansi, UP (Live Shift Hours & Availability)
          </h2>
          <p className="text-xs text-slate-400">
            Search for doctors across Jhansi hospitals (MLB Medical College, District Hospital, St. Jude's, Nirmal, Sudha) by name, specialty, or symptoms.
          </p>
        </div>

        {/* Success Alert Banner */}
        {bookingSuccess && (
          <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center space-x-2 animate-fade-in shadow-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>{bookingSuccess}</span>
          </div>
        )}

        {/* TWO DEDICATED SEARCH COLUMNS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-darkbg border border-teal-500/20">
          {/* Column 1: Doctor Name Input */}
          <div>
            <label className="block text-xs font-bold text-teal-300 mb-1.5 flex items-center space-x-1">
              <User className="w-3.5 h-3.5 text-teal-400" />
              <span>COLUMN 1: Enter Doctor's Name</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Dr. Prashant Gupta, Dr. Niranjan, Dr. P. K. Jain..."
                value={doctorNameInput}
                onChange={(e) => setDoctorNameInput(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-900 border border-darkborder rounded-xl text-xs text-white focus:outline-none focus:border-teal-400 font-semibold"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Direct search for specific physician in Jhansi</p>
          </div>

          {/* Column 2: Specialist Title Input */}
          <div>
            <label className="block text-xs font-bold text-cyan-300 mb-1.5 flex items-center space-x-1">
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>COLUMN 2: Enter Specialist Title</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Cardiologist, Orthopedic, Pulmonologist, Trauma..."
                value={specialistTypeInput}
                onChange={(e) => setSpecialistTypeInput(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-900 border border-darkborder rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 font-semibold"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Search by specialty or department title</p>
          </div>
        </div>

        {/* Quick Specialist Chips */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300">Quick Specialist Selectors:</label>
          <div className="flex flex-wrap gap-2">
            {predefinedSpecialists.map((s) => (
              <button
                key={s.value}
                onClick={() => setSpecialistTypeInput(specialistTypeInput === s.value ? '' : s.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                  specialistTypeInput === s.value
                    ? 'bg-cyan-500 text-darkbg border-cyan-400 shadow-md shadow-cyan-500/20 font-bold'
                    : 'bg-darkbg text-slate-300 border-darkborder hover:border-slate-600'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Additional Filters: Symptom & Locality */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-darkborder/60">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Optional Symptom Filter</label>
            <input
              type="text"
              placeholder="e.g. Chest pain, Fracture, Fever..."
              value={selectedSymptom}
              onChange={(e) => setSelectedSymptom(e.target.value)}
              className="w-full px-3.5 py-2 bg-darkbg border border-darkborder rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Filter by Jhansi Locality</label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full px-3.5 py-2 bg-darkbg border border-darkborder rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-500"
            >
              <option value="">All Jhansi Localities</option>
              <option value="Civil Lines (Jhansi)">Civil Lines (Jhansi)</option>
              <option value="Medical College Zone (Jhansi)">Medical College Zone (Jhansi)</option>
              <option value="SIPRI Bazar (Jhansi)">SIPRI Bazar (Jhansi)</option>
              <option value="Gwalior Road (Jhansi)">Gwalior Road (Jhansi)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Doctor & Hospital Search Results List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
          Matching Hospitals & Doctor Availability in Jhansi ({hospitals.length})
        </h3>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Searching doctors & shift availability in Jhansi...</div>
        ) : hospitals.length === 0 ? (
          <div className="glass-panel p-8 rounded-2xl text-center text-slate-400 text-sm">
            No matching doctors or specialists found for entered criteria in Jhansi.
          </div>
        ) : (
          <div className="space-y-6">
            {hospitals.map((hosp) => (
              <div key={hosp.hospitalId} className="glass-panel p-6 rounded-2xl border border-darkborder space-y-4 hover:border-teal-500/40 transition">
                {/* Hospital Information Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-darkborder/60 pb-3">
                  <div>
                    <h4 className="font-bold text-base text-white flex items-center space-x-2 font-heading">
                      <Building2 className="w-5 h-5 text-teal-400" />
                      <span>{hosp.name}</span>
                    </h4>
                    <p className="text-xs text-slate-400 flex items-center space-x-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{hosp.address} ({hosp.area}) | Phone: {hosp.phone}</span>
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 text-xs">
                    <span className="px-2.5 py-1 rounded-lg font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {hosp.freeBeds} Beds Free ({hosp.freeICU} ICUs)
                    </span>
                  </div>
                </div>

                {/* Specialist Doctor Cards with Availability Timings */}
                <div className="space-y-3">
                  <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                    <UserCheck className="w-4 h-4 text-teal-400" />
                    <span>Specialist Doctor Profiles Available at {hosp.name}:</span>
                  </h5>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {hosp.matchingSpecialists && hosp.matchingSpecialists.length > 0 ? (
                      hosp.matchingSpecialists.map((doc) => (
                        <div key={doc.id} className="p-4 rounded-xl bg-darkbg border border-darkborder space-y-3 relative overflow-hidden">
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">{doc.specialistTitle || doc.department}</span>
                              <h6 className="font-bold text-sm text-white">{doc.name}</h6>
                              <p className="text-[11px] text-slate-400">{doc.qualification}</p>
                            </div>

                            <span
                              className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase border ${
                                doc.currentStatus === 'AVAILABLE_NOW'
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              }`}
                            >
                              {doc.currentStatus === 'AVAILABLE_NOW' ? '🟢 Available Now' : '🟡 In Consultation'}
                            </span>
                          </div>

                          {/* Consultation Shift Timings, Next Slot & Room */}
                          <div className="space-y-1.5 text-xs pt-2 border-t border-darkborder/50">
                            <div className="flex items-center justify-between text-slate-300">
                              <span className="text-slate-400 flex items-center space-x-1">
                                <Clock className="w-3.5 h-3.5 text-amber-400" />
                                <span>Consultation Shift Hours:</span>
                              </span>
                              <span className="font-bold text-amber-300">{doc.consultationHours}</span>
                            </div>

                            <div className="flex items-center justify-between text-slate-300">
                              <span className="text-slate-400">Next Available Slot:</span>
                              <span className="font-bold text-emerald-400">{doc.nextAvailableSlot}</span>
                            </div>

                            <div className="flex items-center justify-between text-slate-300">
                              <span className="text-slate-400">Consultation Counter / Room:</span>
                              <span className="font-semibold text-slate-200">{doc.opdRoom}</span>
                            </div>

                            <div className="flex items-center justify-between text-slate-300">
                              <span className="text-slate-400">Hospital Facility:</span>
                              <span className="font-semibold text-teal-300 truncate max-w-[180px]">{hosp.name}</span>
                            </div>
                          </div>

                          {/* Direct Token Reservation Button */}
                          <button
                            onClick={() => handleBookDoctorToken(doc.name, hosp.name, doc.consultationHours, doc.opdRoom)}
                            className="w-full py-2 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 hover:from-teal-500/30 hover:to-emerald-500/30 text-teal-300 border border-teal-500/40 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Reserve Direct Consultation Token with {doc.name.split(' ')[1]}</span>
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 text-xs text-slate-400 italic">No specialist matching this query at this facility. Emergency Triage Medical Officer available 24/7.</div>
                    )}
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
