import React, { useState } from 'react';
import { Shield, Lock, Key, AlertCircle, X, Award } from 'lucide-react';
import { apiRequest } from '../utils/api';

export default function CmoLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [username, setUsername] = useState('cmo_jhansi');
  const [password, setPassword] = useState('cmojhansi123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await apiRequest('/auth/cmo-login', 'POST', { username, password });
    setLoading(false);

    if (res.success) {
      onLoginSuccess(res.user);
      onClose();
    } else {
      setError(res.message || 'Invalid CMO Credentials');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="glass-panel p-6 rounded-2xl border border-purple-500/30 max-w-md w-full space-y-4 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 border-b border-darkborder pb-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-heading text-white">Chief Medical Officer (CMO) Login</h3>
            <p className="text-xs text-purple-300">District Health Command & Emergency Surge Control</p>
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
            <label className="block text-xs font-semibold text-slate-300 mb-1">CMO Official Username</label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. cmo_jhansi"
                className="w-full pl-9 pr-3.5 py-2 bg-darkbg border border-darkborder rounded-xl text-sm text-slate-200"
              />
              <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Passcode</label>
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

          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs text-purple-200 space-y-1">
            <div className="font-bold flex items-center space-x-1">
              <Award className="w-4 h-4 text-purple-400" />
              <span>Demo CMO Credentials:</span>
            </div>
            <div>Username: <strong className="text-white">cmo_jhansi</strong> | Password: <strong className="text-white">cmojhansi123</strong></div>
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
              className="px-5 py-2 bg-purple-500 hover:bg-purple-400 text-white font-bold rounded-xl text-xs transition"
            >
              {loading ? 'Authenticating...' : 'Login to District Command'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
