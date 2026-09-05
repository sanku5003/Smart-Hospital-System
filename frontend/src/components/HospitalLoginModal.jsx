import React, { useState } from 'react';
import { Building2, Lock, Key, CheckCircle2, AlertCircle, X, ShieldCheck } from 'lucide-react';
import { apiRequest } from '../utils/api';

export default function HospitalLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [username, setUsername] = useState('mlb_admin');
  const [password, setPassword] = useState('hospital123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await apiRequest('/auth/hospital-login', 'POST', { username, password });
    setLoading(false);

    if (res.success) {
      onLoginSuccess(res.user);
      onClose();
    } else {
      setError(res.message || 'Invalid credentials');
    }
  };

  const handleQuickDemo = (user, pass) => {
    setUsername(user);
    setPassword(pass);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="glass-panel p-6 rounded-2xl border border-blue-500/30 max-w-md w-full space-y-4 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 border-b border-darkborder pb-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-heading text-white">Hospital Operations Staff Login</h3>
            <p className="text-xs text-slate-400">Authenticated access to manage beds, admissions & doctors</p>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Hospital Staff ID / Username</label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. mlb_admin"
                className="w-full pl-9 pr-3.5 py-2 bg-darkbg border border-darkborder rounded-xl text-sm text-slate-200"
              />
              <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3.5 py-2 bg-darkbg border border-darkborder rounded-xl text-sm text-slate-200"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* Quick Demo Credentials Buttons */}
          <div className="space-y-1.5 pt-1">
            <label className="block text-[11px] font-semibold text-slate-400">Click to autofill Jhansi Hospital credentials:</label>
            <div className="flex flex-wrap gap-1.5 text-[10px]">
              <button
                type="button"
                onClick={() => handleQuickDemo('mlb_admin', 'hospital123')}
                className="px-2 py-1 bg-darkbg hover:bg-slate-800 border border-darkborder text-teal-300 rounded font-semibold"
              >
                MLB Medical College
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('civil_admin', 'hospital123')}
                className="px-2 py-1 bg-darkbg hover:bg-slate-800 border border-darkborder text-blue-300 rounded font-semibold"
              >
                District Civil Hospital
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('stjude_admin', 'hospital123')}
                className="px-2 py-1 bg-darkbg hover:bg-slate-800 border border-darkborder text-cyan-300 rounded font-semibold"
              >
                St. Jude's Hospital
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-darkborder">
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
              className="px-5 py-2 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-xl text-xs transition"
            >
              {loading ? 'Authenticating...' : 'Login to Hospital Portal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
