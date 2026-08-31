import React, { useState } from 'react';
import { QrCode, CheckCircle2, X, Camera } from 'lucide-react';
import { apiRequest } from '../utils/api';

export default function QrScannerModal({ isOpen, onClose }) {
  const [scannedTokenNumber, setScannedTokenNumber] = useState('GEN-001');
  const [checkInResult, setCheckInResult] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSimulateScan = async (e) => {
    e.preventDefault();
    if (!scannedTokenNumber) return;

    setLoading(true);
    const res = await apiRequest('/tokens/checkin', 'POST', { tokenNumber: scannedTokenNumber });
    setLoading(false);

    if (res.success) {
      setCheckInResult(res);
    } else {
      alert(`Check-in failed: ${res.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="glass-panel p-6 rounded-2xl border border-teal-500/30 max-w-md w-full space-y-4 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 border-b border-darkborder pb-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-heading text-white">Patient QR Code Check-In</h3>
            <p className="text-xs text-slate-400">Scan digital token QR code on arrival</p>
          </div>
        </div>

        {checkInResult ? (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="font-bold text-lg text-white">Check-In Confirmed!</h4>
            <p className="text-xs text-slate-300">
              Token <strong className="text-teal-300">{checkInResult.token.tokenNumber}</strong> ({checkInResult.token.patientName}) marked as checked-in at {new Date(checkInResult.token.checkInTime).toLocaleTimeString()}.
            </p>
            <button
              onClick={() => {
                setCheckInResult(null);
                onClose();
              }}
              className="w-full py-2 bg-teal-500 text-darkbg font-bold rounded-xl text-xs hover:bg-teal-400"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSimulateScan} className="space-y-4">
            {/* Viewport Simulation Box */}
            <div className="h-44 rounded-xl bg-darkbg border border-teal-500/40 flex flex-col items-center justify-center space-y-2 relative overflow-hidden">
              <div className="w-28 h-28 border-2 border-dashed border-teal-400 rounded-xl flex items-center justify-center animate-pulse">
                <Camera className="w-8 h-8 text-teal-400" />
              </div>
              <span className="text-[11px] text-teal-300 font-semibold">Align Patient QR Code within Scanner Frame</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Token Number Code</label>
              <input
                type="text"
                required
                value={scannedTokenNumber}
                onChange={(e) => setScannedTokenNumber(e.target.value)}
                placeholder="e.g. EMG-001 or GEN-002"
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
                className="px-5 py-2 bg-teal-500 text-darkbg font-bold rounded-xl text-xs hover:bg-teal-400 transition"
              >
                {loading ? 'Confirming...' : 'Simulate Scan & Confirm Arrival'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
