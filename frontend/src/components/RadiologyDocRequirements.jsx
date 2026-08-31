import React, { useState } from 'react';
import { FileText, CheckCircle2, AlertTriangle, ShieldCheck, Info, HelpCircle } from 'lucide-react';

export default function RadiologyDocRequirements() {
  const [selectedScanType, setSelectedScanType] = useState('CT_SCAN');

  const scanGuides = {
    CT_SCAN: {
      title: 'CT Scan (Computed Tomography) & Contrast CT',
      docs: [
        'Doctor\'s written prescription/referral letter with clinical indication',
        'Recent Serum Creatinine Blood Test report (Mandatory within 30 days for Contrast dye injections)',
        'Previous X-Ray, Ultrasound, or CT reports & CDs (if available for comparison)',
        'Government Photo ID proof (Aadhaar / Passport / Voter ID)',
        'Ayushman Bharat / Insurance pre-authorization card (If seeking cashless coverage)'
      ],
      prepInstructions: [
        'Fasting: 4 to 6 hours fasting required prior to Contrast CT Scan.',
        'Allergy Warning: Inform radiology staff if you have asthma, kidney disease, or seafood/iodine allergy.',
        'Hydration: Drink plenty of water after contrast scan to flush out dye.'
      ]
    },
    MRI: {
      title: 'MRI Scan (Magnetic Resonance Imaging)',
      docs: [
        'Doctor\'s referral prescription mentioning target body part & clinical history',
        'Serum Creatinine report (Required if Contrast MRI is prescribed)',
        'Surgical Implant Certificate / Clearance (Mandatory if patient has pacemaker, metal clips, or joint replacements)',
        'Previous MRI films & radiologist consultation reports'
      ],
      prepInstructions: [
        'Metal Screening: Remove all metallic items, jewellery, watches, coins, and hearing aids.',
        'Pacemaker Warning: Patients with non-MRI compatible cardiac pacemakers cannot enter the MRI magnet room.',
        'Claustrophobia: Inform desk if you suffer from claustrophobia; mild sedation can be arranged.'
      ]
    },
    ULTRASOUND: {
      title: 'Ultrasound (USG / Sonography)',
      docs: [
        'Doctor\'s prescription / clinical reference note',
        'Maternal Handheld Record Book (For Obstetric / Pregnancy Sonography scans)',
        'Previous USG report films'
      ],
      prepInstructions: [
        'Abdominal USG: Complete fasting for 6 to 8 hours prior to scan.',
        'Pelvic / KUB USG: Full bladder required. Drink 4-5 glasses of water 1 hour before scan without urinating.'
      ]
    },
    X_RAY: {
      title: 'X-Ray & Mammography',
      docs: [
        'Doctor\'s prescription clearly specifying body part & view (AP/Lateral/Oblique)',
        'Previous X-Ray films for fracture progression comparison'
      ],
      prepInstructions: [
        'Pregnancy Notice: Female patients must inform radiographer if pregnant or suspected pregnant to prevent radiation exposure.'
      ]
    }
  };

  const currentGuide = scanGuides[selectedScanType] || scanGuides['CT_SCAN'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-darkborder space-y-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-semibold mb-2">
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Radiology & Diagnostic Preparation Guide</span>
          </div>
          <h2 className="text-xl font-bold font-heading text-white">
            Document Requirements & Medical History Checklist for Radiology
          </h2>
          <p className="text-xs text-slate-400">
            Review mandatory medical history documents, blood test prerequisites (e.g. Serum Creatinine), and safety fasting guidelines before your radiology scan.
          </p>
        </div>

        {/* Scan Type Tabs */}
        <div className="flex space-x-2 bg-darkbg p-1.5 rounded-xl border border-darkborder overflow-x-auto">
          {[
            { id: 'CT_SCAN', label: 'CT Scan & Contrast CT' },
            { id: 'MRI', label: 'MRI Scan' },
            { id: 'ULTRASOUND', label: 'Ultrasound (USG)' },
            { id: 'X_RAY', label: 'X-Ray & Mammography' }
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedScanType(type.id)}
              className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                selectedScanType === type.id
                  ? 'bg-teal-500 text-darkbg shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Guide Content Card */}
      <div className="glass-panel p-6 rounded-2xl border border-darkborder space-y-6">
        <h3 className="text-lg font-bold font-heading text-white border-b border-darkborder pb-3">
          {currentGuide.title}
        </h3>

        {/* Required Documents List */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center space-x-1.5">
            <FileText className="w-4 h-4" />
            <span>Mandatory Documents & Reports to Bring:</span>
          </h4>

          <div className="space-y-2">
            {currentGuide.docs.map((doc, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-darkbg border border-darkborder flex items-start space-x-3 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{doc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Patient Safety & Preparation Guidelines */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1.5">
            <AlertTriangle className="w-4 h-4" />
            <span>Safety Guidelines & Fasting Instructions:</span>
          </h4>

          <div className="space-y-2">
            {currentGuide.prepInstructions.map((prep, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start space-x-3 text-xs text-amber-200">
                <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>{prep}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
