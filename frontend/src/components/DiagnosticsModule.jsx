import React, { useState, useEffect } from 'react';
import { Stethoscope, Calendar, Clock, CheckCircle, AlertTriangle, Plus } from 'lucide-react';
import { apiRequest } from '../utils/api';

export default function DiagnosticsModule() {
  const [diagnostics, setDiagnostics] = useState([]);
  const [bloodBank, setBloodBank] = useState([]);
  const [bookingModal, setBookingModal] = useState(null);
  const [patientName, setPatientName] = useState('');
  const [tokenNumber, setTokenNumber] = useState('');
  const [timeSlot, setTimeSlot] = useState('11:30 AM');
  const [reserveBloodGroup, setReserveBloodGroup] = useState(null);
  const [reserveUnits, setReserveUnits] = useState(1);

  const fetchData = async () => {
    const res = await apiRequest('/hospital/HOSP-001');
    if (res.success && res.hospital) {
      setDiagnostics(res.hospital.diagnostics || []);
      setBloodBank(res.hospital.bloodBank || []);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBookScan = async (e) => {
    e.preventDefault();
    if (!bookingModal) return;

    const res = await apiRequest('/hospital/HOSP-001/diagnostics/book', 'POST', {
      diagnosticType: bookingModal.type,
      patientName,
      tokenNumber,
      timeSlot
    });

    if (res.success) {
      alert(`Diagnostic Scan Booked Successfully for ${patientName}!`);
      setBookingModal(null);
      setPatientName('');
      setTokenNumber('');
      fetchData();
    }
  };

  const handleReserveBlood = async (e) => {
    e.preventDefault();
    if (!reserveBloodGroup) return;

    const res = await apiRequest('/hospital/HOSP-001/blood-bank/reserve', 'POST', {
      group: reserveBloodGroup.group,
      units: Number(reserveUnits)
    });

    if (res.success) {
      alert(`Reserved ${reserveUnits} unit(s) of ${reserveBloodGroup.group} Blood successfully!`);
      setReserveBloodGroup(null);
      fetchData();
    } else {
      alert(`Failed to reserve blood: ${res.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Section 1: Diagnostics Machine Queues */}
      <div className="glass-panel p-6 rounded-2xl border border-darkborder space-y-4">
        <div className="flex items-center justify-between border-b border-darkborder pb-4">
          <div>
            <h3 className="text-xl font-bold font-heading text-white flex items-center space-x-2">
              <Stethoscope className="w-5 h-5 text-teal-400" />
              <span>Diagnostic Equipment Bottleneck & Slot Booking Center</span>
            </h3>
            <p className="text-xs text-slate-400">
              Live wait times for CT, MRI, Ultrasound, and X-Ray. Prevents invisible treatment delays when beds are free.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {diagnostics.map((diag) => (
            <div key={diag.type} className="p-4 rounded-xl bg-darkbg border border-darkborder space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-teal-300 font-heading">
                  {diag.type.replace('_', ' ')}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  {diag.activeMachineCount} Active Scanners
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Current Queue:</span>
                  <span className="font-bold text-white">{diag.queueLength} Patients</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Avg Scan Time:</span>
                  <span className="font-bold text-slate-200">{diag.avgTimePerScanMins} mins</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Est. Wait Time:</span>
                  <span className="font-bold text-emerald-400">{diag.queueLength * diag.avgTimePerScanMins} mins</span>
                </div>
              </div>

              <button
                onClick={() => setBookingModal(diag)}
                className="w-full py-2 bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Direct Scan Slot</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Blood Bank Live Inventory & Alerts */}
      <div className="glass-panel p-6 rounded-2xl border border-darkborder space-y-4">
        <div className="flex items-center justify-between border-b border-darkborder pb-4">
          <div>
            <h3 className="text-xl font-bold font-heading text-white flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <span>Live Blood Bank Stock & Automated Low-Stock Alert System</span>
            </h3>
            <p className="text-xs text-slate-400">Realtime stock by blood group. Low stock (&lt; 5 units) triggers emergency alerts.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {bloodBank.map((item) => {
            const isLow = item.unitsAvailable <= item.lowStockThreshold;
            return (
              <div
                key={item.group}
                className={`p-3 rounded-xl border text-center transition ${
                  isLow ? 'bg-rose-500/10 border-rose-500/40 animate-pulse' : 'bg-darkbg border-darkborder'
                }`}
              >
                <div className="text-lg font-black font-heading text-white">{item.group}</div>
                <div className={`text-xl font-bold mt-1 ${isLow ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {item.unitsAvailable} <span className="text-[10px] font-normal text-slate-400">Units</span>
                </div>
                {isLow && (
                  <span className="inline-block mt-1 px-1.5 py-0.5 text-[9px] font-bold bg-rose-500 text-white rounded">
                    CRITICAL LOW
                  </span>
                )}
                <button
                  onClick={() => setReserveBloodGroup(item)}
                  className="w-full mt-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold rounded transition"
                >
                  Reserve Unit
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Slot Booking Modal */}
      {bookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="glass-panel p-6 rounded-2xl border border-teal-500/30 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold font-heading text-white">
              Book {bookingModal.type.replace('_', ' ')} Slot
            </h3>
            <form onSubmit={handleBookScan} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Patient Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Verma"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-3 py-2 bg-darkbg border border-darkborder rounded-lg text-sm text-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Token Number (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. GEN-102"
                  value={tokenNumber}
                  onChange={(e) => setTokenNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-darkbg border border-darkborder rounded-lg text-sm text-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Preferred Time Slot</label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-3 py-2 bg-darkbg border border-darkborder rounded-lg text-sm text-slate-200"
                >
                  <option value="Immediate Emergency Slot">Immediate Emergency Slot</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="04:30 PM">04:30 PM</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBookingModal(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-400 rounded-lg text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-500 text-darkbg rounded-lg text-xs font-bold hover:bg-teal-400"
                >
                  Confirm Slot Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Blood Reserve Modal */}
      {reserveBloodGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="glass-panel p-6 rounded-2xl border border-rose-500/30 max-w-sm w-full space-y-4">
            <h3 className="text-lg font-bold font-heading text-white">
              Reserve {reserveBloodGroup.group} Blood Units
            </h3>
            <form onSubmit={handleReserveBlood} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Units Needed (Available: {reserveBloodGroup.unitsAvailable})
                </label>
                <input
                  type="number"
                  min="1"
                  max={reserveBloodGroup.unitsAvailable}
                  value={reserveUnits}
                  onChange={(e) => setReserveUnits(e.target.value)}
                  className="w-full px-3 py-2 bg-darkbg border border-darkborder rounded-lg text-sm text-slate-200"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReserveBloodGroup(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-400 rounded-lg text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-500 text-white rounded-lg text-xs font-bold hover:bg-rose-600"
                >
                  Confirm Blood Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
