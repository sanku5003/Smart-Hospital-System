import React from 'react';
import { User, Building2, Shield, HeartHandshake, Crown, Lock, Unlock } from 'lucide-react';

export default function RoleSwitcher({
  currentRole,
  onRoleChange,
  authUser,
  onOpenHospitalLogin,
  onOpenCmoLogin,
  onOpenSuperAdminLogin,
  onLogout
}) {
  const roles = [
    {
      id: 'PATIENT',
      label: 'Patient Portal',
      desc: 'Open Direct Access',
      icon: User,
      requiresAuth: false,
      color: 'from-teal-500/20 to-emerald-500/20 text-teal-300 border-teal-500/40'
    },
    {
      id: 'VILLAGE_MITRA',
      label: 'Gram Swasthya Mitra',
      desc: 'Village Representative',
      icon: HeartHandshake,
      requiresAuth: false,
      color: 'from-emerald-500/20 to-lime-500/20 text-emerald-300 border-emerald-500/40'
    },
    {
      id: 'HOSPITAL',
      label: 'Hospital Staff Portal',
      desc: 'Requires Login',
      icon: Building2,
      requiresAuth: true,
      color: 'from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/40'
    },
    {
      id: 'CMO_ADMIN',
      label: 'CMO District Command',
      desc: 'District Health Officer Login',
      icon: Shield,
      requiresAuth: true,
      color: 'from-purple-500/20 to-indigo-500/20 text-purple-300 border-purple-500/40'
    },
    {
      id: 'SUPER_ADMIN',
      label: 'Super Admin Portal',
      desc: 'JWT Provisioning Suite',
      icon: Crown,
      requiresAuth: true,
      color: 'from-amber-500/20 to-yellow-500/20 text-amber-300 border-amber-500/40'
    }
  ];

  const handleRoleClick = (roleObj) => {
    if (roleObj.requiresAuth) {
      if (authUser && authUser.role === roleObj.id) {
        onRoleChange(roleObj.id);
      } else {
        if (roleObj.id === 'HOSPITAL') onOpenHospitalLogin();
        if (roleObj.id === 'CMO_ADMIN') onOpenCmoLogin();
        if (roleObj.id === 'SUPER_ADMIN') onOpenSuperAdminLogin();
      }
    } else {
      onRoleChange(roleObj.id);
    }
  };

  return (
    <div className="bg-darkcard/80 border-b border-darkborder py-2.5 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400">
          <span className="text-teal-400 font-bold">Portal Access Control:</span>
          <span>(Patients & Mitras = Open Access | Staff, CMO & Super Admin = JWT Auth)</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {roles.map((r) => {
            const Icon = r.icon;
            const isSelected = currentRole === r.id;
            const isAuthenticated = authUser && authUser.role === r.id;

            return (
              <button
                key={r.id}
                onClick={() => handleRoleClick(r)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                  isSelected
                    ? `bg-gradient-to-r ${r.color} shadow-lg shadow-teal-500/10 scale-105`
                    : 'bg-darkbg text-slate-400 border-darkborder hover:text-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-teal-400' : 'text-slate-400'}`} />
                <span>{r.label}</span>

                {r.requiresAuth ? (
                  isAuthenticated ? (
                    <Unlock className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Lock className="w-3 h-3 text-amber-400" />
                  )
                ) : (
                  <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1 rounded">OPEN</span>
                )}
              </button>
            );
          })}

          {authUser && (
            <button
              onClick={onLogout}
              className="px-2.5 py-1 text-[11px] bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-xl font-bold transition"
            >
              Logout ({authUser.name || authUser.username})
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
