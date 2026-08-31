import React, { useState } from 'react';
import { Ambulance, CheckCircle2, Clock, ShieldAlert, X } from 'lucide-react';
import { apiRequest } from '../utils/api';

export default function AmbulancePreArrival({ isOpen, onClose }) {
  const [patientName, setPatientName] = useState('');
  const [severityCondition, setSeverityCondition] = useState('Acute Myocardial Infarction (Heart Attack)');
  const [category, setCategory] = useState('ICU');
  const [etaMins, setEtaMins] = useState(12);
  const [ambulanceUnit, setAmbulanceUnit] = useState('DL-01-AMB-99');
  const [loading, setLoading] = useState(false);
  const [reservationResult, setReservationResult] = useState(null);

  if (!isOpen) return null;

  const handleReserve = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await apiRequest('/city/ambulance-reserve', 'POST', {
      hospitalId: 'HOSP-001',
      patientName,
      severityCondition,
      category,
      etaMins: Number(etaMins),
      ambulanceUnit
    });
    setLoading(false);

    if (res.success) {
      setReservationResult(res.reservation);
    } else {
      alert(`Error reserving bed: ${res.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 max-w-lg w-full space-y-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 border-b border-darkborder pb-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Ambulance className="w-6 h-6 animate-bounce-subtle" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-heading text-white">Ambulance Pre-Arrival Bed Reservation</h3>
            <p className="text-xs text-slate-400">Pre-allocate emergency/ICU bed before arrival</p>
          </div>
        </div>

        {reservationResult ? (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/40 space-y-3">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              <span>EMERGENCY BED RESERVED EN-ROUTE!</span>
            </div>
            <div className="text-xs space-y-1 text-slate-200">
              <div>Reserved Bed: <span className="font-extrabold text-white">{reservationResult.bedNumber} ({reservationResult.category})</span></div>
              <div>Ambulance Unit: <span className="font-bold text-amber-300">{reservationResult.ambulanceUnit}</span></div>
              <div>Estimated Arrival (ETA): <span className="font-bold text-emerald-300">{reservationResult.etaMins} Minutes</span></div>
              <p className="text-slate-400 pt-2 border-t border-emerald-500/20">
                Hospital emergency medical team & duty doctor have been notified via Socket.IO real-time alert!
              </p>
            </div>
            <button
              onClick={() => {
                setReservationResult(null);
                onClose();
              }}
              className="w-full py-2 bg-emerald-500 text-darkbg font-bold rounded-lg text-xs"
            >
              Close Notification
            </button>
          </div>
        ) : (
          <form onSubmit={handleReserve} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Critical Patient Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Vikramaditya Rao"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full px-3.5 py-2 bg-darkbg border border-darkborder rounded-xl text-sm text-slate-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Required Bed Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2 bg-darkbg border border-darkborder rounded-xl text-sm text-slate-200"
                >
                  <option value="ICU">ICU Bed</option>
                  <option value="EMERGENCY">Emergency Trauma Bed</option>
                  <option value="VENTILATOR">Ventilator Unit</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Ambulance Call Sign</label>
                <input
                  type="text"
                  value={ambulanceUnit}
                  onChange={(e) => setAmbulanceUnit(e.target.value)}
                  className="w-full px-3.5 py-2 bg-darkbg border border-darkborder rounded-xl text-sm text-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Severity / Medical Condition</label>
              <input
                type="text"
                required
                value={severityCondition}
                onChange={(e) => setSeverityCondition(e.target.value)}
                className="w-full px-3.5 py-2 bg-darkbg border border-darkborder rounded-xl text-sm text-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">ETA (Minutes to Arrival)</label>
              <input
                type="number"
                min="1"
                max="60"
                value={etaMins}
                onChange={(e) => setEtaMins(e.target.value)}
                className="w-full px-3.5 py-2 bg-darkbg border border-darkborder rounded-xl text-sm text-slate-200"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 text-slate-400 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 bg-emerald-500 text-darkbg font-bold rounded-xl text-xs hover:bg-emerald-400 transition"
              >
                {loading ? 'Reserving...' : 'Confirm Pre-Arrival Reservation'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
