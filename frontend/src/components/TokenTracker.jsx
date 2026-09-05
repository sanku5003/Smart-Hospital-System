import React, { useState, useEffect } from 'react';
import {
  Activity,
  BellRing,
  QrCode,
  Star,
  CheckCircle2,
  Clock,
  User,
  Phone,
  AlertCircle,
  Volume2,
  Stethoscope,
  MapPin,
  Building2
} from 'lucide-react';
import { apiRequest } from '../utils/api';
import { useSocket } from '../context/SocketContext';

export default function TokenTracker({ onOpenQrScanner, role = 'PATIENT' }) {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTokenForFeedback, setSelectedTokenForFeedback] = useState(null);
  const [rating, setRating] = useState(5);
  const [feedbackComments, setFeedbackComments] = useState('');
  const [actualWaitTime, setActualWaitTime] = useState(12);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const { socket } = useSocket();

  const isHospitalStaff = role === 'HOSPITAL' || role === 'CMO_ADMIN' || role === 'SUPER_ADMIN';

  const fetchTokens = async () => {
    setLoading(true);
    const data = await apiRequest('/tokens?hospitalId=HOSP-001');
    if (data.success) {
      setTokens(data.tokens || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTokens();

    if (socket) {
      socket.on('token-created', () => fetchTokens());
      socket.on('queue-updated', () => fetchTokens());
      socket.on('token-status-changed', () => fetchTokens());
      socket.on('patient-checked-in', () => fetchTokens());
    }

    return () => {
      if (socket) {
        socket.off('token-created');
        socket.off('queue-updated');
        socket.off('token-status-changed');
        socket.off('patient-checked-in');
      }
    };
  }, [socket]);

  const handleUpdateStatus = async (tokenNumber, status) => {
    await apiRequest(`/tokens/${tokenNumber}/status`, 'PATCH', { status });
    fetchTokens();
  };

  const playAlertSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch (e) {
      console.log('Audio Context restricted');
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTokenForFeedback) return;

    const res = await apiRequest('/feedback', 'POST', {
      tokenNumber: selectedTokenForFeedback.tokenNumber,
      hospitalId: selectedTokenForFeedback.hospitalId,
      department: selectedTokenForFeedback.department,
      rating,
      actualWaitTimeMins: actualWaitTime,
      comments: feedbackComments
    });

    if (res.success) {
      setFeedbackSuccess(true);
      setTimeout(() => {
        setFeedbackSuccess(false);
        setSelectedTokenForFeedback(null);
      }, 2000);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'IN_CONSULTATION':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'COMPLETED':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'ADMITTED':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'CANCELLED':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      default:
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-5 rounded-2xl border border-darkborder">
        <div>
          <h2 className="text-xl font-bold font-heading text-white flex items-center space-x-2">
            <Activity className="w-5 h-5 text-teal-400" />
            <span>Live Priority OPD Queue & Near-Turn Notification Engine</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Tokens ordered dynamically by triage category (Emergency → Vulnerable → General) & AI severity score.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenQrScanner}
            className="flex items-center space-x-2 px-3.5 py-2 bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-xl text-xs font-semibold transition"
          >
            <QrCode className="w-4 h-4" />
            <span>Scan Patient QR Check-In</span>
          </button>
          <button
            onClick={playAlertSound}
            className="flex items-center space-x-1.5 px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-semibold transition"
          >
            <Volume2 className="w-4 h-4" />
            <span>Test Audio Alert</span>
          </button>
        </div>
      </div>

      {/* Live Queue Table */}
      <div className="glass-panel rounded-2xl border border-darkborder overflow-hidden">
        <div className="px-6 py-4 border-b border-darkborder flex items-center justify-between bg-darkcard/50">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Active Tokens Queue ({tokens.length})
          </span>
          <span className="text-xs text-teal-400 flex items-center space-x-1 font-semibold">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping inline-block"></span>
            <span>Realtime Auto-Sync Active</span>
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Loading Live Priority Queue...</div>
        ) : tokens.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">No active tokens in queue.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-darkbg text-slate-400 font-semibold border-b border-darkborder uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Priority Rank</th>
                  <th className="px-6 py-3.5">Token #</th>
                  <th className="px-6 py-3.5">Patient Details</th>
                  <th className="px-6 py-3.5">Triage & Severity</th>
                  <th className="px-6 py-3.5">Department</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Est. Wait</th>
                  <th className="px-6 py-3.5">Check-In</th>
                  {/* DYNAMIC COLUMN: Hospital Staff sees editable control; Patient sees Doctor & Hospital Address */}
                  <th className="px-6 py-3.5">
                    {isHospitalStaff ? 'Staff Action Control' : 'Doctor Name & Hospital Address'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-darkborder/50 text-slate-200">
                {tokens.map((token, index) => (
                  <tr
                    key={token.tokenNumber}
                    className={`hover:bg-slate-800/40 transition ${
                      token.triageCategory === 'EMERGENCY' ? 'bg-rose-500/5' : ''
                    }`}
                  >
                    <td className="px-6 py-4 font-bold text-slate-300">
                      #{index + 1}
                    </td>
                    <td className="px-6 py-4 font-extrabold text-sm text-teal-300">
                      {token.tokenNumber}
                    </td>
                    <td className="px-6 py-4 space-y-0.5">
                      <div className="font-semibold text-white flex items-center space-x-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{token.patientName}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center space-x-1">
                        <Phone className="w-3 h-3 text-slate-500" />
                        <span>{token.phone} ({token.age} yrs, {token.gender})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 space-y-1">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${
                          token.triageCategory === 'EMERGENCY'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            : token.triageCategory === 'VULNERABLE'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                        }`}
                      >
                        {token.triageCategory}
                      </span>
                      <div className="text-[11px] font-medium text-slate-400">
                        Score: <span className="text-amber-400 font-bold">{token.severityScore}/10</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-200">
                      {token.department}
                    </td>

                    {/* READ-ONLY STATUS BADGE FOR ALL USERS */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold border uppercase ${getStatusBadgeClass(
                          token.status
                        )}`}
                      >
                        {token.status ? token.status.replace('_', ' ') : 'WAITING'}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-semibold text-emerald-400">
                      {token.estimatedWaitMins} mins
                    </td>
                    <td className="px-6 py-4">
                      {token.checkedIn ? (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center space-x-1 w-max">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Checked In</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center space-x-1 w-max">
                          <Clock className="w-3 h-3" />
                          <span>Awaiting QR</span>
                        </span>
                      )}
                    </td>

                    {/* DYNAMIC CELL: EDITABLE DROPDOWN FOR STAFF; READ-ONLY DOCTOR & ADDRESS FOR PATIENTS */}
                    <td className="px-6 py-4 space-x-2">
                      {isHospitalStaff ? (
                        // HOSPITAL STAFF VIEW: Editable status dropdown menu
                        <div className="flex items-center space-x-2">
                          <select
                            value={token.status}
                            onChange={(e) => handleUpdateStatus(token.tokenNumber, e.target.value)}
                            className="px-2.5 py-1.5 bg-darkbg border border-teal-500/40 text-teal-300 rounded-lg text-xs font-bold focus:outline-none focus:border-teal-400 cursor-pointer"
                          >
                            <option value="WAITING">WAITING</option>
                            <option value="IN_CONSULTATION">IN CONSULTATION</option>
                            <option value="DIAGNOSTIC_PENDING">DIAGNOSTIC PENDING</option>
                            <option value="ADMITTED">ADMITTED</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>

                          {token.status === 'COMPLETED' && (
                            <button
                              onClick={() => setSelectedTokenForFeedback(token)}
                              className="px-2 py-1 bg-teal-500/20 text-teal-300 rounded text-[11px] font-semibold hover:bg-teal-500/30"
                            >
                              Rate Visit
                            </button>
                          )}
                        </div>
                      ) : (
                        // PATIENT PORTAL VIEW: Plain read-only Doctor Name and Hospital Address
                        <div className="space-y-1">
                          <div className="font-bold text-teal-300 flex items-center space-x-1.5">
                            <Stethoscope className="w-4 h-4 text-teal-400 flex-shrink-0" />
                            <span>{token.assignedDoctor || 'Dr. V. K. Paul'} ({token.assignedCounter || 'Counter 1'})</span>
                          </div>
                          <div className="text-[11px] text-slate-300 flex items-start space-x-1.5">
                            <MapPin className="w-3.5 h-3.5 text-rose-400 flex-shrink-0 mt-0.5" />
                            <span>
                              <strong className="text-white">MLB Medical College & Super Specialty Hospital</strong>, Kanpur-Gwalior Bypass Road, Medical College Campus, Jhansi, UP 284128
                            </span>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Post-Visit Feedback Modal */}
      {selectedTokenForFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="glass-panel p-6 rounded-2xl border border-teal-500/30 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold font-heading text-white flex items-center space-x-2">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span>Post-Visit Feedback for {selectedTokenForFeedback.tokenNumber}</span>
            </h3>

            {feedbackSuccess ? (
              <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-center font-bold">
                Thank you! Feedback saved and fed to AI Prediction engine.
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Service Quality Rating</label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 transition"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Actual Wait Time Experienced (mins)</label>
                  <input
                    type="number"
                    value={actualWaitTime}
                    onChange={(e) => setActualWaitTime(e.target.value)}
                    className="w-full px-3 py-2 bg-darkbg border border-darkborder rounded-lg text-sm text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Comments / Suggestions</label>
                  <textarea
                    rows="3"
                    placeholder="Describe your care experience..."
                    value={feedbackComments}
                    onChange={(e) => setFeedbackComments(e.target.value)}
                    className="w-full px-3 py-2 bg-darkbg border border-darkborder rounded-lg text-sm text-slate-200"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTokenForFeedback(null)}
                    className="px-4 py-2 bg-slate-800 text-slate-400 rounded-lg text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-500 text-darkbg rounded-lg text-xs font-bold hover:bg-teal-400"
                  >
                    Submit Feedback
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
