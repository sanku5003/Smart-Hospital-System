const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: String, required: true },
  counter: { type: String, required: true },
  activePatients: { type: Number, default: 0 },
  status: { type: String, enum: ['AVAILABLE', 'BUSY', 'OFFLINE'], default: 'AVAILABLE' }
});

const DiagnosticItemSchema = new mongoose.Schema({
  type: { type: String, enum: ['CT_SCAN', 'MRI', 'ULTRASOUND', 'X_RAY'], required: true },
  activeMachineCount: { type: Number, default: 2 },
  queueLength: { type: Number, default: 0 },
  avgTimePerScanMins: { type: Number, default: 20 },
  bookedSlots: [
    {
      patientName: String,
      timeSlot: String,
      tokenNumber: String,
      status: { type: String, enum: ['CONFIRMED', 'COMPLETED', 'CANCELLED'], default: 'CONFIRMED' }
    }
  ]
});

const BloodStockSchema = new mongoose.Schema({
  group: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], required: true },
  unitsAvailable: { type: Number, default: 15 },
  lowStockThreshold: { type: Number, default: 5 },
  reservedUnits: { type: Number, default: 0 }
});

const BedSchema = new mongoose.Schema({
  bedNumber: String,
  category: { type: String, enum: ['ICU', 'EMERGENCY', 'GENERAL', 'VENTILATOR'], required: true },
  status: { type: String, enum: ['AVAILABLE', 'OCCUPIED', 'RESERVED', 'CLEANING'], default: 'AVAILABLE' },
  patientName: String,
  assignedTime: Date,
  estimatedDischargeTime: Date,
  isPreAllocatedAmbulance: { type: Boolean, default: false },
  ambulanceId: String
});

const HospitalSchema = new mongoose.Schema({
  hospitalId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, default: 'Delhi' },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  phone: { type: String, default: '+91 11 2658 8500' },
  beds: [BedSchema],
  doctors: [DoctorSchema],
  diagnostics: [DiagnosticItemSchema],
  bloodBank: [BloodStockSchema],
  isDisasterSurgeMode: { type: Boolean, default: false },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Hospital', HospitalSchema);
