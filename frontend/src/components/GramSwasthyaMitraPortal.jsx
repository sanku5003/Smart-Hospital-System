import React, { useState } from 'react';
import { UserCheck, Mic, MicOff, Send, CheckCircle2, Ambulance, Building2, Phone, QrCode, Sparkles, MapPin, HeartHandshake } from 'lucide-react';
import QRCode from 'qrcode';
import { apiRequest } from '../utils/api';

export default function GramSwasthyaMitraPortal() {
  const [selectedVillage, setSelectedVillage] = useState('Babina Village (Jhansi)');
  const [mitraName, setMitraName] = useState('Ramsewak Yadav (Gram Health Mitra)');
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState(45);
  const [gender, setGender] = useState('Male');
  const [symptoms, setSymptoms] = useState('');
  const [targetHospital, setTargetHospital] = useState('HOSP-001');
  const [dispatchAmbulance, setDispatchAmbulance] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);

  const [registeredVoucher, setRegisteredVoucher] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const jhansiVillages = [
    'Babina Village (Jhansi)',
    'Badagaon (Jhansi)',
    'Mauranipur (Jhansi)',
    'Chirgaon (Jhansi)',
    'Moth Village (Jhansi)',
    'Ranipur (Jhansi)'
  ];

  const jhansiHospitals = [
    { id: 'HOSP-001', name: 'MLB Medical College Jhansi' },
    { id: 'HOSP-002', name: 'District Hospital Jhansi (Civil)' },
    { id: 'HOSP-003', name: "St. Jude's Hospital Jhansi" },
    { id: 'HOSP-004', name: 'Nirmal Trauma Hospital Jhansi' },
    { id: 'HOSP-005', name: 'Sudha Heart Institute Jhansi' }
  ];

  const startVoiceInputHindi = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Voice input not supported in your browser.');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSymptoms((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };

    recognition.start();
  };

  const handleMitraRegistration = async (e) => {
    e.preventDefault();
    if (!patientName || !phone || !symptoms) {
      alert('कृपया मरीज का नाम, मोबाइल नंबर और लक्षण दर्ज करें।');
      return;
    }

    setLoading(true);

    // 1. Register Token via AI Triage
    const res = await apiRequest('/tokens/triage', 'POST', {
      hospitalId: targetHospital,
      patientName: `${patientName} (${selectedVillage})`,
      phone,
      age,
      gender,
      symptoms,
      language: 'Hindi'
    });

    let ambResult = null;
    // 2. Dispatch Ambulance if selected
    if (dispatchAmbulance) {
      ambResult = await apiRequest('/city/ambulance-reserve', 'POST', {
        hospitalId: targetHospital,
        patientName,
        severityCondition: symptoms,
        category: 'EMERGENCY',
        etaMins: 15,
        ambulanceUnit: `UP-108-VILLAGE-${selectedVillage.split(' ')[0]}`
      });
    }

    setLoading(false);

    if (res.success && res.token) {
      setRegisteredVoucher({
        token: res.token,
        village: selectedVillage,
        mitra: mitraName,
        ambulance: ambResult?.reservation || null
      });

      try {
        const qrUrl = await QRCode.toDataURL(res.token.qrCodeData || res.token.tokenNumber);
        setQrCodeUrl(qrUrl);
      } catch (err) {
        console.error(err);
      }
    } else {
      alert(`त्रुटि: ${res.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner - Hindi / English Rural Health Mitra Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-teal-500/30 bg-gradient-to-r from-teal-950 via-slate-900 to-darkcard space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-darkborder pb-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-bold mb-2">
              <HeartHandshake className="w-4 h-4 text-emerald-400" />
              <span>ग्राम स्वास्थ्य मित्र पोर्टल (Gram Swasthya Mitra Portal)</span>
            </div>
            <h2 className="text-2xl font-bold font-heading text-white">
              Rural Village Health Representative Portal (ग्राम स्वास्थ्य केंद्र - झाँसी)
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Empowering village representatives to assist rural patients in local Hindi: Register admissions, triage symptoms, and dispatch UP 108 Ambulances to Jhansi hospitals.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-darkbg border border-teal-500/30 text-xs text-slate-300 space-y-1">
            <span className="text-[10px] text-teal-400 font-bold uppercase tracking-wider block">Logged in Mitra Representative:</span>
            <div className="font-bold text-white flex items-center space-x-1">
              <UserCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>{mitraName}</span>
            </div>
          </div>
        </div>

        {/* Village Selection Bar */}
        <div className="flex items-center space-x-3 pt-1">
          <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1">
            <MapPin className="w-4 h-4 text-teal-400" />
            <span>Select Your Village (ग्राम का चयन करें):</span>
          </label>
          <select
            value={selectedVillage}
            onChange={(e) => setSelectedVillage(e.target.value)}
            className="px-3.5 py-2 bg-darkbg border border-teal-500/40 rounded-xl text-xs text-slate-200 font-bold focus:outline-none focus:border-teal-400"
          >
            {jhansiVillages.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleMitraRegistration} className="glass-panel p-6 rounded-2xl border border-darkborder space-y-4">
            <h3 className="text-lg font-bold font-heading text-white border-b border-darkborder pb-3 flex items-center space-x-2">
              <UserCheck className="w-5 h-5 text-teal-400" />
              <span>1. ग्रामीण मरीज की जानकारी (Patient Details)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">मरीज का नाम (Patient Full Name) *</label>
                <input
                  type="text"
                  required
                  placeholder="उदा. रामप्रसाद कुशवाहा"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">मोबाइल नंबर (Mobile Phone) *</label>
                <input
                  type="tel"
                  required
                  placeholder="उदा. +91 94500 12345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">आयु (Age)</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">लिंग (Gender)</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-slate-200"
                >
                  <option value="Male">पुरुष (Male)</option>
                  <option value="Female">महिला (Female)</option>
                  <option value="Other">अन्य (Other)</option>
                </select>
              </div>
            </div>

            <h3 className="text-lg font-bold font-heading text-white border-b border-darkborder pb-3 pt-2 flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-teal-400" />
              <span>2. बीमारी के लक्षण व अस्पताल चयन (Symptoms & Hospital)</span>
            </h3>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-300">
                  बीमारी के लक्षण (Describe Health Problem in Hindi / Voice)
                </label>
                <button
                  type="button"
                  onClick={startVoiceInputHindi}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                    isListening
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                      : 'bg-teal-500/10 text-teal-300 border border-teal-500/30'
                  }`}
                >
                  {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  <span>{isListening ? 'सुन रहे हैं...' : 'हिंदी में बोलें (Hindi Voice)'}</span>
                </button>
              </div>
              <textarea
                rows="3"
                required
                placeholder="उदा. 2 दिन से बहुत तेज बुखार और छाती में दर्द..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">झाँसी का अस्पताल चुनें (Target Jhansi Hospital)</label>
              <select
                value={targetHospital}
                onChange={(e) => setTargetHospital(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-slate-200"
              >
                {jhansiHospitals.map((h) => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2 pt-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <input
                type="checkbox"
                id="dispatch"
                checked={dispatchAmbulance}
                onChange={(e) => setDispatchAmbulance(e.target.checked)}
                className="w-4 h-4 text-amber-500 bg-darkbg border-darkborder rounded"
              />
              <label htmlFor="dispatch" className="text-xs font-bold text-amber-300 flex items-center space-x-1.5">
                <Ambulance className="w-4 h-4 text-amber-400" />
                <span>गाँव से तुरंत UP 108 एम्बुलेंस बुलाएँ (Dispatch Emergency 108 Ambulance)</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-darkbg font-bold rounded-xl shadow-lg shadow-teal-500/20 text-sm flex items-center justify-center space-x-2"
            >
              {loading ? (
                <span>पंजीकरण हो रहा है...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>ग्राम मरीज टोकन व अस्पताल बेड बुक करें (Submit Village Admission)</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Issued Voucher Result Column */}
        <div className="lg:col-span-5 space-y-6">
          {registeredVoucher ? (
            <div className="glass-panel-glow p-6 rounded-2xl border border-teal-500/30 space-y-5 animate-fade-in">
              <div className="flex items-center justify-between border-b border-teal-500/20 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">Gram Admission Voucher</span>
                  <h3 className="text-3xl font-extrabold font-heading text-white">{registeredVoucher.token.tokenNumber}</h3>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  CONFIRMED
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-darkborder space-y-2 text-xs text-slate-200">
                <div>मरीज का नाम: <strong className="text-white">{registeredVoucher.token.patientName}</strong></div>
                <div>ग्राम स्थान: <strong className="text-teal-300">{registeredVoucher.village}</strong></div>
                <div>स्वास्थ्य मित्र: <strong className="text-slate-300">{registeredVoucher.mitra}</strong></div>
                <div>अस्पताल: <strong className="text-emerald-300">{registeredVoucher.token.department}</strong></div>
              </div>

              {registeredVoucher.ambulance && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 space-y-1">
                  <div className="font-bold flex items-center space-x-1">
                    <Ambulance className="w-4 h-4 text-amber-400" />
                    <span>UP 108 एम्बुलेंस अलर्ट (Ambulance Reserved):</span>
                  </div>
                  <div>Call Sign: <strong className="text-white">{registeredVoucher.ambulance.ambulanceUnit}</strong></div>
                  <div>ETA Arrival: <strong className="text-emerald-400">15 mins to {registeredVoucher.village}</strong></div>
                </div>
              )}

              {qrCodeUrl && (
                <div className="flex items-center space-x-3 p-3 bg-darkbg border border-darkborder rounded-xl">
                  <img src={qrCodeUrl} alt="Voucher QR" className="w-20 h-20 bg-white p-1 rounded" />
                  <div className="text-[11px] text-slate-300">
                    <strong>Voucher Slip Ready:</strong> Show this QR code upon arrival at Jhansi hospital reception desk.
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-panel p-8 rounded-2xl border border-darkborder text-center text-slate-400 text-sm flex flex-col items-center justify-center min-h-[420px] space-y-3">
              <QrCode className="w-12 h-12 text-teal-400" />
              <h4 className="font-bold text-white">ग्राम मरीज टोकन पर्चा (Village Voucher Slip)</h4>
              <p className="text-xs text-slate-400 max-w-xs">
                Fill patient symptoms on the left to generate an instant token slip with UP 108 ambulance reservation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
