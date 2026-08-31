import React from 'react';
import { User, Building2, Shield, Sparkles } from 'lucide-react';

export default function RoleSwitcher({ currentRole, onRoleChange }) {
  const roles = [
    {
      id: 'PATIENT',
      label: 'Patient Portal',
      desc: 'AI Triage, Tokens, Area Stats & Symptom Search',
      icon: User,
      badge: 'Public Portal',
      color: 'from-teal-500/20 to-emerald-500/20 text-teal-300 border-teal-500/40'
    },
    {
      id: 'HOSPITAL',
      label: 'Hospital Staff Portal',
      desc: 'Live Beds, Doctors, Diagnostics & Blood Bank',
      icon: Building2,
      badge: 'Ops Desk',
      color: 'from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/40'
    },
    {
      id: 'CITY_ADMIN',
      label: 'City Health Authority',
      desc: 'Regional Stream, Area Analytics & Disaster Mode',
      icon: Shield,
      badge: 'City Net',
      color: 'from-purple-500/20 to-indigo-500/20 text-purple-300 border-purple-500/40'
    }
  ];

  return (
    <div className="bg-darkcard/80 border-b border-darkborder py-2.5 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span>Active Role Access Panel:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {roles.map((r) => {
            const Icon = r.icon;
            const isSelected = currentRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => onRoleChange(r.id)}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition border ${
                  isSelected
                    ? `bg-gradient-to-r ${r.color} shadow-lg shadow-teal-500/10 scale-105`
                    : 'bg-darkbg text-slate-400 border-darkborder hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-teal-400' : 'text-slate-400'}`} />
                <span>{r.label}</span>
                {isSelected && (
                  <span className="px-1.5 py-0.2 text-[9px] bg-teal-500/30 text-teal-200 rounded">ACTIVE</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
