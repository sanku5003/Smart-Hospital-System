const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  tokenNumber: { type: String, required: true, unique: true },
  hospitalId: { type: String, required: true, default: 'HOSP-001' },
  patientName: { type: String, required: true },
  phone: { type: String, required: true },
  age: { type: Number, default: 30 },
  gender: { type: String, default: 'Other' },
  symptoms: { type: String, required: true },
  language: { type: String, default: 'English' },
  triageCategory: {
    type: String,
    enum: ['EMERGENCY', 'VULNERABLE', 'GENERAL'],
    default: 'GENERAL'
  },
  severityScore: { type: Number, min: 1, max: 10, default: 3 },
  department: { type: String, required: true },
  assignedCounter: { type: String, default: 'Counter 1' },
  assignedDoctor: { type: String, default: 'Duty Medical Officer' },
  status: {
    type: String,
    enum: ['WAITING', 'IN_CONSULTATION', 'DIAGNOSTIC_PENDING', 'ADMITTED', 'COMPLETED', 'CANCELLED'],
    default: 'WAITING'
  },
  checkedIn: { type: Boolean, default: false },
  checkInTime: { type: Date },
  estimatedWaitMins: { type: Number, default: 15 },
  qrCodeData: { type: String },
  aiGuidance: {
    urgencyLevel: String,
    recommendedAction: String,
    whatToBring: [String],
    govtSchemeNote: String
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Token', TokenSchema);
