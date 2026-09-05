import React from 'react';
import { FileText, Building2, CheckCircle2, ShieldCheck, HelpCircle, Download, Phone, MapPin, Award } from 'lucide-react';

export default function HospitalOnboardingDocs() {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-darkborder bg-gradient-to-r from-darkcard via-slate-900 to-darkcard space-y-3">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30 text-xs font-semibold">
          <FileText className="w-3.5 h-3.5 text-teal-400" />
          <span>Hospital Onboarding & Registration Documentation</span>
        </div>
        <h2 className="text-2xl font-bold font-heading text-white">
          How New Hospitals Can Apply for Network Registration (Offline Workflow Guide)
        </h2>
        <p className="text-xs text-slate-300 max-w-3xl">
          Detailed guidelines for private and government medical establishments in Jhansi district requesting digital profile onboarding and bed stream integration into MedPulse CityNet.
        </p>
      </div>

      {/* Onboarding Phases Step-by-Step */}
      <div className="glass-panel p-6 rounded-2xl border border-darkborder space-y-6">
        <h3 className="text-lg font-bold font-heading text-white border-b border-darkborder pb-3 flex items-center space-x-2">
          <Building2 className="w-5 h-5 text-teal-400" />
          <span>Step-by-Step Hospital Onboarding & Registration Procedure</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-darkbg border border-darkborder space-y-2">
            <span className="w-7 h-7 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold text-xs">1</span>
            <h4 className="font-bold text-sm text-white">Phase 1: Offline Application</h4>
            <p className="text-xs text-slate-400">
              Submit physical registration dossier to the **Chief Medical Officer (CMO) Office, Jhansi** with hospital details, bed capacity, and doctor licenses.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-darkbg border border-darkborder space-y-2">
            <span className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold text-xs">2</span>
            <h4 className="font-bold text-sm text-white">Phase 2: Physical Inspection</h4>
            <p className="text-xs text-slate-400">
              District Health Inspection Team verifies physical ICU beds, ventilator count, CT/MRI scanner calibration, and emergency oxygen supply.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-darkbg border border-darkborder space-y-2">
            <span className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-xs">3</span>
            <h4 className="font-bold text-sm text-white">Phase 3: Digital Provisioning</h4>
            <p className="text-xs text-slate-400">
              Upon CMO clearance, **State Super Admin** provisions the hospital profile, generates JWT staff login credentials, and activates live bed streaming.
            </p>
          </div>
        </div>

        {/* Mandatory Documents Checklist */}
        <div className="space-y-3 pt-4 border-t border-darkborder">
          <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Mandatory Documents Required for Offline Application:</span>
          </h4>

          <div className="space-y-2">
            {[
              'State Medical Establishment Registration Certificate (Form B)',
              'Fire Safety Clearance No Objection Certificate (NOC)',
              'State Pollution Control Board Biomedical Waste Disposal Authorization',
              'Notarized Affidavit of ICU, Emergency, Ventilator & General Ward Bed Capacity',
              'List of Duty Doctors, Specialists & Medical Council Registration Numbers',
              'Emergency Oxygen Generator / Cylinder Capacity Clearance Certificate'
            ].map((doc, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-darkbg border border-darkborder flex items-start space-x-3 text-xs text-slate-200">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{doc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Helpdesk */}
        <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-bold text-teal-300 block">District Health Office Onboarding Helpdesk (Jhansi):</span>
            <span className="text-slate-300">CMO Office, Civil Lines, Near Elite Crossing, Jhansi, UP 284001</span>
          </div>
          <div className="text-right">
            <span className="text-slate-400 block">Helpline Phone:</span>
            <span className="font-bold text-white text-sm">+91 510 247 0044</span>
          </div>
        </div>
      </div>
    </div>
  );
}
