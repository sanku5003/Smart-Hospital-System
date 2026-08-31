import React, { useState } from 'react';
import RoleSwitcher from './components/RoleSwitcher';
import Navbar from './components/Navbar';
import PatientKiosk from './components/PatientKiosk';
import TokenTracker from './components/TokenTracker';
import HospitalDashboard from './components/HospitalDashboard';
import DiagnosticsModule from './components/DiagnosticsModule';
import AnalyticsHeatmap from './components/AnalyticsHeatmap';
import CrowdDensityCV from './components/CrowdDensityCV';
import CityMap from './components/CityMap';
import AreaHealthDashboard from './components/AreaHealthDashboard';
import SymptomHospitalFilter from './components/SymptomHospitalFilter';
import RadiologyDocRequirements from './components/RadiologyDocRequirements';
import AmbulancePreArrival from './components/AmbulancePreArrival';
import DisasterModeModal from './components/DisasterModeModal';
import QrScannerModal from './components/QrScannerModal';

export default function App() {
  const [role, setRole] = useState('PATIENT'); // 'PATIENT' | 'HOSPITAL' | 'CITY_ADMIN'
  const [activeTab, setActiveTab] = useState('kiosk');

  const [isAmbulanceModalOpen, setIsAmbulanceModalOpen] = useState(false);
  const [isDisasterModalOpen, setIsDisasterModalOpen] = useState(false);
  const [isQrScannerModalOpen, setIsQrScannerModalOpen] = useState(false);
  const [isDisasterModeActive, setIsDisasterModeActive] = useState(false);

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    if (newRole === 'PATIENT') setActiveTab('kiosk');
    if (newRole === 'HOSPITAL') setActiveTab('hospital');
    if (newRole === 'CITY_ADMIN') setActiveTab('citymap');
  };

  return (
    <div className="min-h-screen bg-darkbg text-slate-100 flex flex-col font-sans">
      {/* Top Role Panel Switcher */}
      <RoleSwitcher currentRole={role} onRoleChange={handleRoleChange} />

      {/* Main Navbar */}
      <Navbar
        role={role}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAmbulanceModal={() => setIsAmbulanceModalOpen(true)}
        onOpenDisasterModal={() => setIsDisasterModalOpen(true)}
        isDisasterModeActive={isDisasterModeActive}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Patient Portal Views */}
        {activeTab === 'kiosk' && (
          <PatientKiosk onTokenCreated={() => setActiveTab('queue')} />
        )}
        {activeTab === 'queue' && (
          <TokenTracker onOpenQrScanner={() => setIsQrScannerModalOpen(true)} />
        )}
        {activeTab === 'area-stats' && <AreaHealthDashboard />}
        {activeTab === 'symptom-filter' && <SymptomHospitalFilter />}
        {activeTab === 'radiology-docs' && <RadiologyDocRequirements />}

        {/* Hospital Operations Views */}
        {activeTab === 'hospital' && <HospitalDashboard />}
        {activeTab === 'diagnostics' && <DiagnosticsModule />}
        {activeTab === 'cv' && <CrowdDensityCV />}
        {activeTab === 'analytics' && <AnalyticsHeatmap />}

        {/* City Authority Views */}
        {activeTab === 'citymap' && (
          <CityMap
            onOpenAmbulanceModal={() => setIsAmbulanceModalOpen(true)}
            onOpenDisasterModal={() => setIsDisasterModalOpen(true)}
          />
        )}
      </main>

      {/* Global Footer */}
      <footer className="bg-darkcard border-t border-darkborder py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
          <p>© 2026 MedPulse CityNet — Role-Based Smart Hospital & Locality Intelligence Infrastructure</p>
        </div>
      </footer>

      {/* Global Modals */}
      <AmbulancePreArrival
        isOpen={isAmbulanceModalOpen}
        onClose={() => setIsAmbulanceModalOpen(false)}
      />

      <DisasterModeModal
        isOpen={isDisasterModalOpen}
        onClose={() => setIsDisasterModalOpen(false)}
        onDisasterStateChanged={(state) => setIsDisasterModeActive(state)}
      />

      <QrScannerModal
        isOpen={isQrScannerModalOpen}
        onClose={() => setIsQrScannerModalOpen(false)}
      />
    </div>
  );
}
