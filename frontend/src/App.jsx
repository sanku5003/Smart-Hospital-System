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
import GramSwasthyaMitraPortal from './components/GramSwasthyaMitraPortal';
import SuperAdminPortal from './components/SuperAdminPortal';
import HospitalOnboardingDocs from './components/HospitalOnboardingDocs';
import HospitalLoginModal from './components/HospitalLoginModal';
import CmoLoginModal from './components/CmoLoginModal';
import SuperAdminLoginModal from './components/SuperAdminLoginModal';
import AmbulancePreArrival from './components/AmbulancePreArrival';
import DisasterModeModal from './components/DisasterModeModal';
import QrScannerModal from './components/QrScannerModal';

export default function App() {
  const [role, setRole] = useState('PATIENT'); // 'PATIENT' | 'VILLAGE_MITRA' | 'HOSPITAL' | 'CMO_ADMIN' | 'SUPER_ADMIN'
  const [activeTab, setActiveTab] = useState('kiosk');
  const [selectedCity, setSelectedCity] = useState('Jhansi, UP'); // Global Multi-City Location State

  const [authUser, setAuthUser] = useState(null);
  const [jwtToken, setJwtToken] = useState(null);

  const [isHospitalLoginOpen, setIsHospitalLoginOpen] = useState(false);
  const [isCmoLoginOpen, setIsCmoLoginOpen] = useState(false);
  const [isSuperAdminLoginOpen, setIsSuperAdminLoginOpen] = useState(false);

  const [isAmbulanceModalOpen, setIsAmbulanceModalOpen] = useState(false);
  const [isDisasterModalOpen, setIsDisasterModalOpen] = useState(false);
  const [isQrScannerModalOpen, setIsQrScannerModalOpen] = useState(false);
  const [isDisasterModeActive, setIsDisasterModeActive] = useState(false);

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    if (newRole === 'PATIENT') setActiveTab('kiosk');
    if (newRole === 'VILLAGE_MITRA') setActiveTab('village-mitra');
    if (newRole === 'HOSPITAL') setActiveTab('hospital');
    if (newRole === 'CMO_ADMIN') setActiveTab('citymap');
    if (newRole === 'SUPER_ADMIN') setActiveTab('superadmin');
  };

  const handleLoginSuccess = (userData, token = null) => {
    setAuthUser(userData);
    if (token) setJwtToken(token);
    handleRoleChange(userData.role);
  };

  const handleLogout = () => {
    setAuthUser(null);
    setJwtToken(null);
    handleRoleChange('PATIENT');
  };

  return (
    <div className="min-h-screen bg-darkbg text-slate-100 flex flex-col font-sans">
      {/* Top Role Access Control Switcher */}
      <RoleSwitcher
        currentRole={role}
        onRoleChange={handleRoleChange}
        authUser={authUser}
        onOpenHospitalLogin={() => setIsHospitalLoginOpen(true)}
        onOpenCmoLogin={() => setIsCmoLoginOpen(true)}
        onOpenSuperAdminLogin={() => setIsSuperAdminLoginOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Navbar with Multi-City Location Switcher */}
      <Navbar
        role={role}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        onOpenAmbulanceModal={() => setIsAmbulanceModalOpen(true)}
        onOpenDisasterModal={() => setIsDisasterModalOpen(true)}
        isDisasterModeActive={isDisasterModeActive}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Patient Portal Views (Open Direct Access) */}
        {activeTab === 'kiosk' && (
          <PatientKiosk onTokenCreated={() => setActiveTab('queue')} />
        )}
        {activeTab === 'queue' && (
          <TokenTracker onOpenQrScanner={() => setIsQrScannerModalOpen(true)} />
        )}
        {activeTab === 'area-stats' && <AreaHealthDashboard selectedCity={selectedCity} />}
        {activeTab === 'symptom-filter' && <SymptomHospitalFilter selectedCity={selectedCity} />}
        {activeTab === 'radiology-docs' && <RadiologyDocRequirements />}

        {/* Hospital Onboarding Registration Documentation Guide */}
        {activeTab === 'hospital-onboarding-docs' && <HospitalOnboardingDocs />}

        {/* Gram Swasthya Mitra Portal View (Rural Representative Access) */}
        {activeTab === 'village-mitra' && <GramSwasthyaMitraPortal />}

        {/* Authenticated Super Admin System Provisioning Suite (JWT Protected) */}
        {activeTab === 'superadmin' && <SuperAdminPortal jwtToken={jwtToken} />}

        {/* Authenticated Hospital Operations Views */}
        {activeTab === 'hospital' && <HospitalDashboard />}
        {activeTab === 'diagnostics' && <DiagnosticsModule />}
        {activeTab === 'cv' && <CrowdDensityCV />}
        {activeTab === 'analytics' && <AnalyticsHeatmap />}

        {/* Authenticated CMO District Authority View */}
        {activeTab === 'citymap' && (
          <CityMap
            selectedCity={selectedCity}
            onOpenAmbulanceModal={() => setIsAmbulanceModalOpen(true)}
            onOpenDisasterModal={() => setIsDisasterModalOpen(true)}
          />
        )}
      </main>

      {/* Global Footer */}
      <footer className="bg-darkcard border-t border-darkborder py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
          <p>© 2026 MedPulse CityNet — Multi-City Smart Hospital Infrastructure ({selectedCity})</p>
        </div>
      </footer>

      {/* Global Auth Modals */}
      <HospitalLoginModal
        isOpen={isHospitalLoginOpen}
        onClose={() => setIsHospitalLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <CmoLoginModal
        isOpen={isCmoLoginOpen}
        onClose={() => setIsCmoLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <SuperAdminLoginModal
        isOpen={isSuperAdminLoginOpen}
        onClose={() => setIsSuperAdminLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Action Modals */}
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
