import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, Building2, CheckCircle2, X } from 'lucide-react';
import { apiRequest } from '../utils/api';

export default function DisasterModeModal({ isOpen, onClose, onDisasterStateChanged }) {
  const [incidentLocation, setIncidentLocation] = useState('Connaught Place Junction');
  const [totalCasulties, setTotalCasualties] = useState(30);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);

  if (!isOpen) return null;

  const handleTriggerSurge = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Toggle hospital surge state
    await apiRequest('/hospital/HOSP-001/disaster-mode', 'PATCH', { isDisasterSurgeMode: true });

    // Calculate redistribution plan
    const res = await apiRequest('/city/disaster-redistribute', 'POST', {
      incidentLocation,
      totalCasulties: Number(totalCasulties)
    });

    setLoading(false);
    if (res.success) {
      setPlan(res.redistributionPlan);
      if (onDisasterStateChanged) onDisasterStateChanged(true);
    }
  };

  const handleDeactivate = async () => {
    await apiRequest('/hospital/HOSP-001/disaster-mode', 'PATCH', { isDisasterSurgeMode: false });
    if (onDisasterStateChanged) onDisasterStateChanged(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="glass-panel p-6 rounded-2xl border border-rose-500/40 max-w-2xl w-full space-y-4 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 border-b border-rose-500/30 pb-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-heading text-white">Mass Casualty Disaster & Surge Redistribution</h3>
            <p className="text-xs text-rose-300">City-wide automated patient load balancing protocol</p>
          </div>
        </div>

        {plan ? (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-xs text-rose-200">
              🚨 <strong>SURGE PROTOCOL ACTIVATED:</strong> Casulties automatically redistributed across 5 nearby hospitals based on real-time bed capacity to prevent single-hospital collapse.
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Automatic Redistribution Allocation:</h4>
              {plan.map((item) => (
                <div key={item.hospitalId} className="p-3 rounded-xl bg-darkbg border border-darkborder flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white flex items-center space-x-1">
                      <Building2 className="w-3.5 h-3.5 text-teal-400" />
                      <span>{item.hospitalName}</span>
                    </span>
                    <span className="text-[11px] text-slate-400">Distance: {item.distanceKm} km | Free Beds: {item.availableBeds}</span>
                  </div>
                  <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full font-bold">
                    Assign {item.allocatedCasualties} Casualties
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-2">
              <button
                onClick={handleDeactivate}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-700"
              >
                Deactivate Surge Mode
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 bg-rose-500 text-white rounded-xl text-xs font-bold hover:bg-rose-600"
              >
                Broadcast Protocol to Ambulances
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleTriggerSurge} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Mass Casualty Incident Location *</label>
              <input
                type="text"
                required
                value={incidentLocation}
                onChange={(e) => setIncidentLocation(e.target.value)}
                className="w-full px-3.5 py-2 bg-darkbg border border-darkborder rounded-xl text-sm text-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Estimated Inflow Casualties *</label>
              <input
                type="number"
                min="5"
                max="200"
                value={totalCasulties}
                onChange={(e) => setTotalCasualties(e.target.value)}
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
                className="px-5 py-2 bg-rose-500 text-white font-bold rounded-xl text-xs hover:bg-rose-600 transition"
              >
                {loading ? 'Activating Protocol...' : 'ACTIVATE DISASTER SURGE PROTOCOL'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
