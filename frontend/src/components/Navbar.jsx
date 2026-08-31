import React from 'react';
import {
  Activity,
  Bot,
  LayoutDashboard,
  Stethoscope,
  BarChart3,
  MapPin,
  Ambulance,
  AlertTriangle,
  FileText,
  Search,
  Sparkles
} from 'lucide-react';

export default function Navbar({
  role,
  activeTab,
  setActiveTab,
  onOpenAmbulanceModal,
  onOpenDisasterModal,
  isDisasterModeActive
}) {
  // Navigation tabs defined per Role
  const patientNav = [
    { id: 'kiosk', label: 'AI Triage & Digital Token', icon: Bot },
    { id: 'queue', label: 'My Token Status & Alerts', icon: Activity },
    { id: 'area-stats', label: 'Area Health Statistics', icon: MapPin },
    { id: 'symptom-filter', label: 'Filter Hospitals by Symptoms', icon: Search },
    { id: 'radiology-docs', label: 'Radiology Document Checklist', icon: FileText },
  ];

  const hospitalNav = [
    { id: 'hospital', label: 'Beds Matrix & Load Balancer', icon: LayoutDashboard },
    { id: 'diagnostics', label: 'Diagnostics & Blood Bank Hub', icon: Stethoscope },
    { id: 'queue', label: 'Patient Queue Operations', icon: Activity },
    { id: 'cv', label: 'CCTV Crowd CV Stream', icon: Sparkles },
    { id: 'analytics', label: 'Predictive Load AI', icon: BarChart3 },
  ];

  const cityNav = [
    { id: 'citymap', label: 'City-Wide Hospital Feed & Map', icon: MapPin },
    { id: 'area-stats', label: 'Locality Health Analytics', icon: BarChart3 },
    { id: 'analytics', label: 'AI Time-Series Inflow Forecast', icon: Sparkles },
  ];

  let currentNav = patientNav;
  if (role === 'HOSPITAL') currentNav = hospitalNav;
  if (role === 'CITY_ADMIN') currentNav = cityNav;

  return (
    <header className="sticky top-0 z-40 bg-darkcard/90 backdrop-blur-md border-b border-darkborder shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab(currentNav[0].id)}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Activity className="w-6 h-6 text-darkbg" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-heading text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-emerald-300 to-cyan-400">
                  MedPulse CityNet
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-full uppercase">
                  {role} Portal
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Smart Queue & City Integration Module</p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenAmbulanceModal}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 text-xs font-semibold transition"
            >
              <Ambulance className="w-4 h-4 animate-bounce-subtle" />
              <span className="hidden sm:inline">Ambulance Pre-Arrival</span>
            </button>

            {(role === 'HOSPITAL' || role === 'CITY_ADMIN') && (
              <button
                onClick={onOpenDisasterModal}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                  isDisasterModeActive
                    ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                <span>{isDisasterModeActive ? '🚨 SURGE MODE ACTIVE' : 'Disaster Surge Mode'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Navigation Tabs based on Role */}
        <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-darkborder/50">
          {currentNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm shadow-teal-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
