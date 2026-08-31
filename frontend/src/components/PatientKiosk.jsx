import React, { useState, useEffect } from 'react';
import {
  Bot,
  Mic,
  MicOff,
  Send,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  UserCheck,
  Clock,
  FileText
} from 'lucide-react';
import QRCode from 'qrcode';
import { apiRequest } from '../utils/api';

export default function PatientKiosk({ onTokenCreated }) {
  const [symptoms, setSymptoms] = useState('');
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState(32);
  const [gender, setGender] = useState('Male');
  const [isPregnant, setIsPregnant] = useState(false);
  const [language, setLanguage] = useState('English');
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createdToken, setCreatedToken] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  // Voice Recognition setup
  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Voice input is not supported in your browser. Please type symptoms.');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'Hindi' ? 'hi-IN' : 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSymptoms((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };

    recognition.start();
  };

  const handleTriageSubmit = async (e) => {
    e.preventDefault();
    if (!patientName || !phone || !symptoms) {
      alert('Please fill in Name, Phone, and Symptoms.');
      return;
    }

    setLoading(true);
    const result = await apiRequest('/tokens/triage', 'POST', {
      patientName,
      phone,
      age,
      gender,
      isPregnant,
      symptoms,
      language
    });
    setLoading(false);

    if (result.success && result.token) {
      setCreatedToken(result.token);
      // Generate QR Code data URL
      try {
        const qrDataUrl = await QRCode.toDataURL(result.token.qrCodeData || result.token.tokenNumber);
        setQrCodeUrl(qrDataUrl);
      } catch (qrErr) {
        console.error('QR Generation failed:', qrErr);
      }
      if (onTokenCreated) onTokenCreated(result.token);
    } else {
      alert(`Error creating token: ${result.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-darkborder bg-gradient-to-r from-darkcard via-slate-900 to-darkcard relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Bot className="w-64 h-64 text-teal-400" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Triage & Digital Token Portal</span>
          </div>
          <h2 className="text-2xl font-bold font-heading text-white">Smart Patient Reception & Priority Tokenizer</h2>
          <p className="text-slate-400 text-sm mt-1">
            Describe your health symptoms in voice or text. Our AI instantly triages your case, assigns an urgency severity score, and generates a priority-ordered token to eliminate physical queue waiting.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Patient Registration Form */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleTriageSubmit} className="glass-panel p-6 rounded-2xl border border-darkborder space-y-5">
            <h3 className="text-lg font-bold font-heading text-white flex items-center space-x-2 border-b border-darkborder pb-3">
              <UserCheck className="w-5 h-5 text-teal-400" />
              <span>1. Patient Information & Language</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anjali Sharma"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm focus:outline-none focus:border-teal-500 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Mobile Phone (for SMS updates) *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm focus:outline-none focus:border-teal-500 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Age</label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm focus:outline-none focus:border-teal-500 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm focus:outline-none focus:border-teal-500 text-slate-200"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Preferred Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm focus:outline-none focus:border-teal-500 text-slate-200"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi (हिंदी)</option>
                  <option value="Bengali">Bengali (বাংলা)</option>
                  <option value="Tamil">Tamil (தமிழ்)</option>
                  <option value="Telugu">Telugu (తెలుగు)</option>
                </select>
              </div>

              {gender === 'Female' && (
                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="pregnant"
                    checked={isPregnant}
                    onChange={(e) => setIsPregnant(e.target.checked)}
                    className="w-4 h-4 text-teal-500 bg-darkbg border-darkborder rounded focus:ring-teal-500"
                  />
                  <label htmlFor="pregnant" className="text-xs font-semibold text-amber-300">
                    Pregnant / Maternal Patient (Priority Queue)
                  </label>
                </div>
              )}
            </div>

            <h3 className="text-lg font-bold font-heading text-white flex items-center space-x-2 border-b border-darkborder pb-3 pt-2">
              <Bot className="w-5 h-5 text-teal-400" />
              <span>2. Describe Health Symptoms</span>
            </h3>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-slate-300">
                  What issue are you experiencing today?
                </label>
                <button
                  type="button"
                  onClick={startVoiceInput}
                  className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                    isListening
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                      : 'bg-teal-500/10 text-teal-300 border border-teal-500/30 hover:bg-teal-500/20'
                  }`}
                >
                  {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  <span>{isListening ? 'Listening...' : 'Voice Dictate'}</span>
                </button>
              </div>

              <textarea
                rows="4"
                required
                placeholder="e.g. Severe chest tightness, dizziness for 2 hours, and difficulty breathing..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm focus:outline-none focus:border-teal-500 text-slate-200"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-darkbg font-bold rounded-xl transition shadow-lg shadow-teal-500/20 flex items-center justify-center space-x-2 text-sm"
            >
              {loading ? (
                <span>AI Triaging Case & Generating Token...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit for AI Triage & Get Token</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Generated Token Card & Triage Output */}
        <div className="lg:col-span-5 space-y-6">
          {createdToken ? (
            <div className="glass-panel-glow p-6 rounded-2xl border border-teal-500/30 space-y-5 animate-fade-in relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-teal-500/20 pb-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">Digital Token Issued</span>
                  <h3 className="text-3xl font-extrabold font-heading text-white tracking-tight">
                    {createdToken.tokenNumber}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400">Est. Wait</span>
                  <div className="text-lg font-bold text-emerald-400 flex items-center justify-end space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{createdToken.estimatedWaitMins} mins</span>
                  </div>
                </div>
              </div>

              {/* Triage Badge */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-darkborder space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Triage Category:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase border ${
                      createdToken.triageCategory === 'EMERGENCY'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                        : createdToken.triageCategory === 'VULNERABLE'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                    }`}
                  >
                    {createdToken.triageCategory}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">AI Severity Score:</span>
                  <span className="text-sm font-bold text-amber-400">{createdToken.severityScore} / 10</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Department Routed:</span>
                  <span className="text-sm font-bold text-teal-300">{createdToken.department}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Assigned Desk:</span>
                  <span className="text-sm font-bold text-slate-200">{createdToken.assignedCounter}</span>
                </div>
              </div>

              {/* QR Code & Instructions */}
              <div className="flex items-center space-x-4 p-4 rounded-xl bg-darkbg border border-darkborder">
                {qrCodeUrl && (
                  <img src={qrCodeUrl} alt="Token QR Code" className="w-24 h-24 rounded-lg bg-white p-1 border border-slate-700" />
                )}
                <div className="text-xs space-y-1">
                  <div className="font-bold text-white flex items-center space-x-1">
                    <QrCode className="w-3.5 h-3.5 text-teal-400" />
                    <span>Scan on Arrival</span>
                  </div>
                  <p className="text-slate-400">Show this QR code at hospital kiosk or reception counter to confirm arrival.</p>
                </div>
              </div>

              {/* What to Bring Checklist */}
              {createdToken.aiGuidance?.whatToBring && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1">
                    <FileText className="w-3.5 h-3.5 text-teal-400" />
                    <span>Checklist - What to Bring</span>
                  </h4>
                  <ul className="text-xs text-slate-300 space-y-1 pl-1">
                    {createdToken.aiGuidance.whatToBring.map((item, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Ayushman Bharat Scheme Note */}
              <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-start space-x-2 text-xs">
                <ShieldCheck className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-blue-300">Govt Health Scheme (Ayushman Bharat):</span>
                  <p className="text-slate-300 mt-0.5">{createdToken.aiGuidance?.govtSchemeNote}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-8 rounded-2xl border border-darkborder text-center space-y-4 flex flex-col items-center justify-center min-h-[420px]">
              <div className="w-16 h-16 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-400 border border-teal-500/20">
                <QrCode className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">Your Digital Token Will Appear Here</h3>
              <p className="text-slate-400 text-xs max-w-xs">
                Fill out your details on the left to receive an AI-triaged priority token with instant QR check-in capabilities.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
