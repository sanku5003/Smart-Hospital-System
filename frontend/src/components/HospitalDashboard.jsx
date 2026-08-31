import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  BedDouble,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  Ambulance,
  Stethoscope
} from 'lucide-react';
import { apiRequest } from '../utils/api';
import { useSocket } from '../context/SocketContext';

export default function HospitalDashboard() {
  const [hospital, setHospital] = useState(null);
  const [doctorsLoad, setDoctorsLoad] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();

  const fetchHospitalInfo = async () => {
    setLoading(true);
    const data = await apiRequest('/hospital/HOSP-001');
    const docData = await apiRequest('/hospital/HOSP-001/doctors-load');
    if (data.success) setHospital(data.hospital);
    if (docData.success) setDoctorsLoad(docData.doctors || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchHospitalInfo();

    if (socket) {
      socket.on('hospital-updated', (payload) => {
        if (payload.hospitalId === 'HOSP-001') setHospital(payload.hospital);
      });
    }

    return () => {
      if (socket) socket.off('hospital-updated');
    };
  }, [socket]);

  const handleBedStateChange = async (bedNumber, newStatus) => {
    await apiRequest('/hospital/HOSP-001/beds', 'PATCH', {
      bedNumber,
      status: newStatus
    });
    fetchHospitalInfo();
  };

  if (loading || !hospital) {
    return <div className="p-8 text-center text-slate-400 text-sm">Loading Live Hospital Operations Dashboard...</div>;
  }

  const beds = hospital.beds || [];
  const filteredBeds = selectedCategory === 'ALL' ? beds : beds.filter((b) => b.category === selectedCategory);

  // Statistics
  const totalBeds = beds.length;
  const freeBeds = beds.filter((b) => b.status === 'AVAILABLE').length;
  const freeICU = beds.filter((b) => b.category === 'ICU' && b.status === 'AVAILABLE').length;
  const freeVent = beds.filter((b) => b.category === 'VENTILATOR' && b.status === 'AVAILABLE').length;

  return (
    <div className="space-y-6">
      {/* Top Header & Stat KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-darkborder flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Total Capacity</span>
            <div className="text-2xl font-bold font-heading text-white mt-1">{totalBeds} Beds</div>
            <p className="text-[11px] text-slate-400">Hospital Facility Limit</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center border border-teal-500/20">
            <BedDouble className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-darkborder flex items-center justify-between">
          <div>
            <span className="text-xs text-emerald-400 font-semibold uppercase">Available Beds</span>
            <div className="text-2xl font-bold font-heading text-emerald-300 mt-1">{freeBeds} Free</div>
            <p className="text-[11px] text-emerald-400/80">Ready for Admission</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-darkborder flex items-center justify-between">
          <div>
            <span className="text-xs text-amber-400 font-semibold uppercase">ICU Availability</span>
            <div className="text-2xl font-bold font-heading text-amber-300 mt-1">{freeICU} Available</div>
            <p className="text-[11px] text-slate-400">Critical Care Units</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <Stethoscope className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-darkborder flex items-center justify-between">
          <div>
            <span className="text-xs text-cyan-400 font-semibold uppercase">Ventilator Support</span>
            <div className="text-2xl font-bold font-heading text-cyan-300 mt-1">{freeVent} Available</div>
            <p className="text-[11px] text-slate-400">Life Support Ready</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
            <RefreshCw className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Bed Inventory Matrix */}
      <div className="glass-panel p-6 rounded-2xl border border-darkborder space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-darkborder pb-4">
          <div>
            <h3 className="text-lg font-bold font-heading text-white flex items-center space-x-2">
              <BedDouble className="w-5 h-5 text-teal-400" />
              <span>Real-Time Bed Occupancy & Discharge Prediction Matrix</span>
            </h3>
            <p className="text-xs text-slate-400">Live monitoring of ICU, Ventilator, Emergency, and General Ward beds</p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex space-x-1.5 bg-darkbg p-1 rounded-xl border border-darkborder">
            {['ALL', 'ICU', 'VENTILATOR', 'EMERGENCY', 'GENERAL'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? 'bg-teal-500 text-darkbg shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Bed Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredBeds.map((bed) => (
            <div
              key={bed.bedNumber}
              className={`p-4 rounded-xl border transition-all ${
                bed.status === 'AVAILABLE'
                  ? 'bg-emerald-500/5 border-emerald-500/30 hover:border-emerald-500/60'
                  : bed.status === 'OCCUPIED'
                  ? 'bg-rose-500/5 border-rose-500/30 hover:border-rose-500/60'
                  : bed.status === 'RESERVED'
                  ? 'bg-amber-500/5 border-amber-500/30 hover:border-amber-500/60'
                  : 'bg-slate-800/30 border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-white font-heading">{bed.bedNumber}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                  {bed.category}
                </span>
              </div>

              <div className="mt-3 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Status:</span>
                  <span
                    className={`font-bold ${
                      bed.status === 'AVAILABLE'
                        ? 'text-emerald-400'
                        : bed.status === 'OCCUPIED'
                        ? 'text-rose-400'
                        : bed.status === 'RESERVED'
                        ? 'text-amber-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {bed.status}
                  </span>
                </div>

                {bed.patientName && (
                  <div className="text-xs text-slate-300 truncate font-medium">
                    Patient: {bed.patientName}
                  </div>
                )}

                {bed.isPreAllocatedAmbulance && (
                  <div className="flex items-center space-x-1 text-[11px] text-amber-300 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    <Ambulance className="w-3 h-3 text-amber-400" />
                    <span>Pre-Allocated Ambulance ({bed.ambulanceId})</span>
                  </div>
                )}

                {bed.estimatedDischargeTime && (
                  <div className="flex items-center space-x-1 text-[11px] text-teal-300 font-semibold pt-1">
                    <Clock className="w-3 h-3 text-teal-400" />
                    <span>Predicted Discharge: ~1 hour</span>
                  </div>
                )}
              </div>

              {/* Action Toggle */}
              <div className="mt-3 pt-3 border-t border-darkborder flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Change State:</span>
                <select
                  value={bed.status}
                  onChange={(e) => handleBedStateChange(bed.bedNumber, e.target.value)}
                  className="px-2 py-1 bg-darkbg text-xs text-slate-200 border border-darkborder rounded focus:outline-none"
                >
                  <option value="AVAILABLE">Free Bed</option>
                  <option value="OCCUPIED">Occupy Bed</option>
                  <option value="RESERVED">Reserve Bed</option>
                  <option value="CLEANING">Sanitizing</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Doctor & Counter Load Balancing Section */}
      <div className="glass-panel p-6 rounded-2xl border border-darkborder space-y-4">
        <div className="flex items-center justify-between border-b border-darkborder pb-3">
          <div>
            <h3 className="text-lg font-bold font-heading text-white flex items-center space-x-2">
              <Users className="w-5 h-5 text-teal-400" />
              <span>Doctor & Counter Shortest-Queue Load Balancer</span>
            </h3>
            <p className="text-xs text-slate-400">System automatically routes incoming tokens to counters with the shortest line</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctorsLoad.map((doc) => (
            <div key={doc.name} className="p-4 rounded-xl bg-darkbg border border-darkborder space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white">{doc.name}</h4>
                  <p className="text-xs text-teal-400 font-semibold">{doc.department} ({doc.counter})</p>
                </div>
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                    doc.queueLength <= 2 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                  }`}
                >
                  {doc.queueLength <= 2 ? 'SHORTEST QUEUE' : 'MODERATE'}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-darkborder/50">
                <span className="text-slate-400">Waiting Patients:</span>
                <span className="font-bold text-white text-sm">{doc.queueLength} Patients</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Est. Queue Time:</span>
                <span className="font-semibold text-emerald-400">{doc.estimatedWaitMins} mins</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
