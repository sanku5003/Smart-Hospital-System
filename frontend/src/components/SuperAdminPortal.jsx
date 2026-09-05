import React, { useState, useEffect } from 'react';
import { Crown, Building2, Shield, HeartHandshake, Plus, CheckCircle2, UserCheck, Activity, Users, FileText } from 'lucide-react';
import { apiRequest } from '../utils/api';

export default function SuperAdminPortal({ jwtToken }) {
  const [activeTab, setActiveTab] = useState('cmo'); // 'cmo' | 'hospital' | 'mitra'
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  // Forms State
  const [cmoName, setCmoName] = useState('');
  const [cmoDistrict, setCmoDistrict] = useState('Jhansi, Uttar Pradesh');
  const [cmoUser, setCmoUser] = useState('');
  const [cmoPass, setCmoPass] = useState('cmo123');

  const [hospName, setHospName] = useState('');
  const [hospAddress, setHospAddress] = useState('');
  const [hospArea, setHospArea] = useState('Civil Lines (Jhansi)');
  const [hospPhone, setHospPhone] = useState('+91 510 244 0000');
  const [hospBeds, setHospBeds] = useState(150);

  const [mitraName, setMitraName] = useState('');
  const [mitraVillage, setMitraVillage] = useState('Babina Village (Jhansi)');
  const [mitraPhone, setMitraPhone] = useState('');

  const fetchOverview = async () => {
    setLoading(true);
    const res = await apiRequest('/admin/system-stats');
    if (res.success) {
      setOverview(res);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const handleProvisionCmo = async (e) => {
    e.preventDefault();
    const res = await apiRequest('/admin/provision-cmo', 'POST', {
      name: cmoName,
      district: cmoDistrict,
      username: cmoUser,
      password: cmoPass
    });

    if (res.success) {
      setFeedbackMsg(`CMO Officer Profile Provisioned for ${cmoName}!`);
      setCmoName('');
      setCmoUser('');
      fetchOverview();
      setTimeout(() => setFeedbackMsg(null), 4000);
    } else {
      alert(`Error provisioning CMO: ${res.message}`);
    }
  };

  const handleProvisionHospital = async (e) => {
    e.preventDefault();
    const res = await apiRequest('/admin/provision-hospital', 'POST', {
      name: hospName,
      address: hospAddress,
      area: hospArea,
      phone: hospPhone,
      totalBeds: Number(hospBeds)
    });

    if (res.success) {
      setFeedbackMsg(`Hospital Profile Provisioned for ${hospName}!`);
      setHospName('');
      setHospAddress('');
      fetchOverview();
      setTimeout(() => setFeedbackMsg(null), 4000);
    } else {
      alert(`Error provisioning Hospital: ${res.message}`);
    }
  };

  const handleProvisionMitra = async (e) => {
    e.preventDefault();
    const res = await apiRequest('/admin/provision-mitra', 'POST', {
      name: mitraName,
      village: mitraVillage,
      phone: mitraPhone
    });

    if (res.success) {
      setFeedbackMsg(`Gram Swasthya Mitra Provisioned for ${mitraName} (${mitraVillage})!`);
      setMitraName('');
      setMitraPhone('');
      fetchOverview();
      setTimeout(() => setFeedbackMsg(null), 4000);
    } else {
      alert(`Error provisioning Mitra: ${res.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950 via-slate-900 to-darkcard space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-darkborder pb-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold mb-2">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>Super Admin System Provisioning Suite (State Health Ministry)</span>
            </div>
            <h2 className="text-2xl font-bold font-heading text-white">
              State Health Provisioning & Profile Management Dashboard
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Create and provision authenticated profiles for Chief Medical Officers (CMO), Jhansi Hospitals, and Gram Swasthya Mitras.
            </p>
          </div>
        </div>

        {/* System Overview Stat Cards */}
        {overview?.metrics && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
            <div className="p-3.5 rounded-xl bg-darkbg border border-darkborder">
              <span className="text-xs text-slate-400 font-semibold">Active State Hospitals</span>
              <div className="text-xl font-bold text-white mt-1">{overview.metrics.totalHospitals} Facilities</div>
            </div>
            <div className="p-3.5 rounded-xl bg-darkbg border border-darkborder">
              <span className="text-xs text-purple-400 font-semibold">Provisioned CMO Officers</span>
              <div className="text-xl font-bold text-purple-300 mt-1">{overview.metrics.activeCmoOfficers} Officers</div>
            </div>
            <div className="p-3.5 rounded-xl bg-darkbg border border-darkborder">
              <span className="text-xs text-emerald-400 font-semibold">Village Health Mitras</span>
              <div className="text-xl font-bold text-emerald-300 mt-1">{overview.metrics.registeredMitras} Representatives</div>
            </div>
            <div className="p-3.5 rounded-xl bg-darkbg border border-darkborder">
              <span className="text-xs text-teal-400 font-semibold">System Digital Tokens</span>
              <div className="text-xl font-bold text-teal-300 mt-1">{overview.metrics.totalTokensProcessed} Issued</div>
            </div>
          </div>
        )}
      </div>

      {/* Success Notification Banner */}
      {feedbackMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center space-x-2 animate-fade-in shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Provisioning Forms Suite */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="glass-panel p-6 rounded-2xl border border-darkborder space-y-5">
            <div className="flex space-x-2 border-b border-darkborder pb-3">
              <button
                onClick={() => setActiveTab('cmo')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeTab === 'cmo' ? 'bg-amber-500 text-darkbg' : 'text-slate-400 hover:text-white'
                }`}
              >
                ➕ Provision CMO
              </button>
              <button
                onClick={() => setActiveTab('hospital')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeTab === 'hospital' ? 'bg-amber-500 text-darkbg' : 'text-slate-400 hover:text-white'
                }`}
              >
                ➕ Provision Hospital Profile
              </button>
              <button
                onClick={() => setActiveTab('mitra')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeTab === 'mitra' ? 'bg-amber-500 text-darkbg' : 'text-slate-400 hover:text-white'
                }`}
              >
                ➕ Provision Village Mitra
              </button>
            </div>

            {/* Form 1: Provision CMO */}
            {activeTab === 'cmo' && (
              <form onSubmit={handleProvisionCmo} className="space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span>Provision Chief Medical Officer (CMO District Officer)</span>
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">CMO Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Sudhir Kumar"
                    value={cmoName}
                    onChange={(e) => setCmoName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-darkbg border border-darkborder rounded-xl text-xs text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">District / Jurisdiction</label>
                  <input
                    type="text"
                    required
                    value={cmoDistrict}
                    onChange={(e) => setCmoDistrict(e.target.value)}
                    className="w-full px-3.5 py-2 bg-darkbg border border-darkborder rounded-xl text-xs text-slate-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Official Username</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. cmo_jhansi"
                      value={cmoUser}
                      onChange={(e) => setCmoUser(e.target.value)}
                      className="w-full px-3.5 py-2 bg-darkbg border border-darkborder rounded-xl text-xs text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Initial Password</label>
                    <input
                      type="password"
                      required
                      value={cmoPass}
                      onChange={(e) => setCmoPass(e.target.value)}
                      className="w-full px-3.5 py-2 bg-darkbg border border-darkborder rounded-xl text-xs text-slate-200"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-darkbg font-bold rounded-xl text-xs transition"
                >
                  Create CMO Official Profile
                </button>
              </form>
            )}

            {/* Form 2: Provision Hospital Profile */}
            {activeTab === 'hospital' && (
              <form onSubmit={handleProvisionHospital} className="space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-amber-400" />
                  <span>Provision New Hospital Profile</span>
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Hospital Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maharani Laxmi Bai Super Specialty Hospital"
                    value={hospName}
                    onChange={(e) => setHospName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-darkbg border border-darkborder rounded-xl text-xs text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kanpur-Gwalior Bypass Road, Jhansi"
                    value={hospAddress}
                    onChange={(e) => setHospAddress(e.target.value)}
                    className="w-full px-3.5 py-2 bg-darkbg border border-darkborder rounded-xl text-xs text-slate-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Locality Area</label>
                    <select
                      value={hospArea}
                      onChange={(e) => setHospArea(e.target.value)}
                      className="w-full px-3.5 py-2 bg-darkbg border border-darkborder rounded-xl text-xs text-slate-200"
                    >
                      <option value="Civil Lines (Jhansi)">Civil Lines (Jhansi)</option>
                      <option value="Medical College Zone (Jhansi)">Medical College Zone (Jhansi)</option>
                      <option value="SIPRI Bazar (Jhansi)">SIPRI Bazar (Jhansi)</option>
                      <option value="Gwalior Road (Jhansi)">Gwalior Road (Jhansi)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Emergency Phone</label>
                    <input
                      type="text"
                      value={hospPhone}
                      onChange={(e) => setHospPhone(e.target.value)}
                      className="w-full px-3.5 py-2 bg-darkbg border border-darkborder rounded-xl text-xs text-slate-200"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-darkbg font-bold rounded-xl text-xs transition"
                >
                  Create & Activate Hospital Profile
                </button>
              </form>
            )}

            {/* Form 3: Provision Gram Swasthya Mitra */}
            {activeTab === 'mitra' && (
              <form onSubmit={handleProvisionMitra} className="space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <HeartHandshake className="w-4 h-4 text-amber-400" />
                  <span>Provision Gram Swasthya Mitra (Village Health Representative)</span>
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Representative Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kamlesh Bundela"
                    value={mitraName}
                    onChange={(e) => setMitraName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-darkbg border border-darkborder rounded-xl text-xs text-slate-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Assigned Village</label>
                    <select
                      value={mitraVillage}
                      onChange={(e) => setMitraVillage(e.target.value)}
                      className="w-full px-3.5 py-2 bg-darkbg border border-darkborder rounded-xl text-xs text-slate-200"
                    >
                      <option value="Babina Village (Jhansi)">Babina Village (Jhansi)</option>
                      <option value="Badagaon (Jhansi)">Badagaon (Jhansi)</option>
                      <option value="Mauranipur (Jhansi)">Mauranipur (Jhansi)</option>
                      <option value="Chirgaon (Jhansi)">Chirgaon (Jhansi)</option>
                      <option value="Moth Village (Jhansi)">Moth Village (Jhansi)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 94500 99999"
                      value={mitraPhone}
                      onChange={(e) => setMitraPhone(e.target.value)}
                      className="w-full px-3.5 py-2 bg-darkbg border border-darkborder rounded-xl text-xs text-slate-200"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-darkbg font-bold rounded-xl text-xs transition"
                >
                  Create Village Mitra Account
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Directory Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="glass-panel p-6 rounded-2xl border border-darkborder space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Active State User Directory ({overview?.directory?.cmos?.length || 1} CMOs, {overview?.directory?.mitras?.length || 2} Mitras)
            </h3>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-purple-300 uppercase">Provisioned District CMO Officers:</h4>
              {overview?.directory?.cmos?.map((c) => (
                <div key={c.cmoId} className="p-3 rounded-xl bg-darkbg border border-darkborder flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">{c.name}</span>
                    <span className="text-slate-400 text-[11px]">{c.district} | ID: {c.cmoId}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {c.status}
                  </span>
                </div>
              ))}

              <h4 className="text-xs font-bold text-emerald-300 uppercase pt-2">Provisioned Village Health Mitras:</h4>
              {overview?.directory?.mitras?.map((m) => (
                <div key={m.mitraId} className="p-3 rounded-xl bg-darkbg border border-darkborder flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">{m.name}</span>
                    <span className="text-slate-400 text-[11px]">{m.village} | Phone: {m.phone}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {m.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
