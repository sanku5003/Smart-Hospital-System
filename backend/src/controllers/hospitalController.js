const Hospital = require('../models/Hospital');
const Token = require('../models/Token');
const { getPredictiveAnalytics } = require('../services/predictionEngine');

// Get single hospital details or seed default if empty
async function getHospitalData(req, res) {
  try {
    const { hospitalId = 'HOSP-001' } = req.params;
    let hospital = await Hospital.findOne({ hospitalId });

    if (!hospital) {
      // Seed initial mock hospital if missing
      hospital = await seedHospital(hospitalId);
    }

    // Fetch active tokens for load balancing calculation
    const activeTokens = await Token.find({ hospitalId, status: { $in: ['WAITING', 'IN_CONSULTATION'] } });

    res.json({ success: true, hospital, activeTokensCount: activeTokens.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// Update Bed status or Pre-allocate for Ambulance
async function updateBedStatus(req, res) {
  try {
    const { hospitalId = 'HOSP-001' } = req.params;
    const { bedNumber, status, patientName, isPreAllocatedAmbulance, ambulanceId } = req.body;

    const hospital = await Hospital.findOne({ hospitalId });
    if (!hospital) return res.status(404).json({ success: false, message: 'Hospital not found' });

    const bed = hospital.beds.find(b => b.bedNumber === bedNumber);
    if (!bed) return res.status(404).json({ success: false, message: 'Bed not found' });

    if (status) bed.status = status;
    if (patientName !== undefined) bed.patientName = patientName;
    if (isPreAllocatedAmbulance !== undefined) bed.isPreAllocatedAmbulance = isPreAllocatedAmbulance;
    if (ambulanceId !== undefined) bed.ambulanceId = ambulanceId;
    if (status === 'OCCUPIED') bed.assignedTime = new Date();

    hospital.lastUpdated = new Date();
    await hospital.save();

    // Broadcast real-time update via Socket.IO
    if (req.io) {
      req.io.emit('hospital-updated', { hospitalId, hospital });
      req.io.emit('city-beds-updated', { hospitalId, beds: hospital.beds });
    }

    res.json({ success: true, bed, hospital });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// Doctor Counter Load Balancing calculation
async function getDoctorLoadBalancing(req, res) {
  try {
    const { hospitalId = 'HOSP-001' } = req.params;
    const hospital = await Hospital.findOne({ hospitalId });
    if (!hospital) return res.status(404).json({ success: false, message: 'Hospital not found' });

    // Calculate queue length per doctor/counter
    const waitingTokens = await Token.find({ hospitalId, status: 'WAITING' });
    
    const doctorStats = hospital.doctors.map(doc => {
      const docTokens = waitingTokens.filter(t => t.assignedDoctor === doc.name || t.department === doc.department);
      return {
        ...doc.toObject(),
        queueLength: docTokens.length,
        estimatedWaitMins: docTokens.length * 10
      };
    });

    res.json({ success: true, doctors: doctorStats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// Book Diagnostic Scan
async function bookDiagnosticScan(req, res) {
  try {
    const { hospitalId = 'HOSP-001' } = req.params;
    const { diagnosticType, patientName, tokenNumber, timeSlot } = req.body;

    const hospital = await Hospital.findOne({ hospitalId });
    if (!hospital) return res.status(404).json({ success: false, message: 'Hospital not found' });

    const diag = hospital.diagnostics.find(d => d.type === diagnosticType);
    if (!diag) return res.status(404).json({ success: false, message: 'Diagnostic type not found' });

    diag.bookedSlots.push({
      patientName,
      tokenNumber,
      timeSlot: timeSlot || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'CONFIRMED'
    });
    diag.queueLength += 1;

    hospital.lastUpdated = new Date();
    await hospital.save();

    // Update token status if token number supplied
    if (tokenNumber) {
      await Token.findOneAndUpdate({ tokenNumber }, { status: 'DIAGNOSTIC_PENDING' });
    }

    if (req.io) req.io.emit('hospital-updated', { hospitalId, hospital });

    res.json({ success: true, diagnostic: diag });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// Reserve Blood Stock
async function reserveBloodStock(req, res) {
  try {
    const { hospitalId = 'HOSP-001' } = req.params;
    const { group, units = 1 } = req.body;

    const hospital = await Hospital.findOne({ hospitalId });
    if (!hospital) return res.status(404).json({ success: false, message: 'Hospital not found' });

    const bloodItem = hospital.bloodBank.find(b => b.group === group);
    if (!bloodItem) return res.status(404).json({ success: false, message: 'Blood group not found' });

    if (bloodItem.unitsAvailable < units) {
      return res.status(400).json({ success: false, message: `Insufficient units for ${group}. Available: ${bloodItem.unitsAvailable}` });
    }

    bloodItem.unitsAvailable -= units;
    bloodItem.reservedUnits += units;

    hospital.lastUpdated = new Date();
    await hospital.save();

    if (req.io) req.io.emit('hospital-updated', { hospitalId, hospital });

    res.json({ success: true, bloodBank: hospital.bloodBank, reservedGroup: group, units });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// Toggle Disaster / Surge Mode
async function toggleDisasterMode(req, res) {
  try {
    const { hospitalId = 'HOSP-001' } = req.params;
    const { isDisasterSurgeMode } = req.body;

    const hospital = await Hospital.findOne({ hospitalId });
    if (!hospital) return res.status(404).json({ success: false, message: 'Hospital not found' });

    hospital.isDisasterSurgeMode = isDisasterSurgeMode;
    hospital.lastUpdated = new Date();
    await hospital.save();

    if (req.io) {
      req.io.emit('disaster-mode-alert', { hospitalId, hospitalName: hospital.name, isDisasterSurgeMode });
      req.io.emit('hospital-updated', { hospitalId, hospital });
    }

    res.json({ success: true, isDisasterSurgeMode: hospital.isDisasterSurgeMode });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// Helper to seed initial hospital data
async function seedHospital(hospitalId = 'HOSP-001') {
  const seed = new Hospital({
    hospitalId,
    name: 'AIIMS Central Super-Specialty Hospital',
    address: 'Sri Aurobindo Marg, Ansari Nagar, New Delhi',
    city: 'Delhi',
    lat: 28.5672,
    lng: 77.2100,
    phone: '+91 11 2658 8500',
    beds: [
      { bedNumber: 'ICU-01', category: 'ICU', status: 'OCCUPIED', patientName: 'Ramesh Kumar', estimatedDischargeTime: new Date(Date.now() + 3600000) },
      { bedNumber: 'ICU-02', category: 'ICU', status: 'AVAILABLE' },
      { bedNumber: 'ICU-03', category: 'ICU', status: 'OCCUPIED', patientName: 'Sunita Sharma' },
      { bedNumber: 'ICU-04', category: 'ICU', status: 'AVAILABLE' },
      { bedNumber: 'VENT-01', category: 'VENTILATOR', status: 'OCCUPIED', patientName: 'Amit Verma' },
      { bedNumber: 'VENT-02', category: 'VENTILATOR', status: 'AVAILABLE' },
      { bedNumber: 'EMG-01', category: 'EMERGENCY', status: 'OCCUPIED', patientName: 'Priya Singh' },
      { bedNumber: 'EMG-02', category: 'EMERGENCY', status: 'AVAILABLE' },
      { bedNumber: 'EMG-03', category: 'EMERGENCY', status: 'AVAILABLE' },
      { bedNumber: 'GEN-101', category: 'GENERAL', status: 'OCCUPIED', patientName: 'Rajesh Gupta' },
      { bedNumber: 'GEN-102', category: 'GENERAL', status: 'AVAILABLE' },
      { bedNumber: 'GEN-103', category: 'GENERAL', status: 'AVAILABLE' },
      { bedNumber: 'GEN-104', category: 'GENERAL', status: 'CLEANING' },
      { bedNumber: 'GEN-105', category: 'GENERAL', status: 'AVAILABLE' }
    ],
    doctors: [
      { name: 'Dr. V. K. Paul', department: 'Emergency', counter: 'Counter 1', activePatients: 4, status: 'AVAILABLE' },
      { name: 'Dr. Randeep Guleria', department: 'Pulmonology', counter: 'Counter 2', activePatients: 6, status: 'AVAILABLE' },
      { name: 'Dr. Naresh Trehan', department: 'Cardiology', counter: 'Counter 3', activePatients: 3, status: 'AVAILABLE' },
      { name: 'Dr. Ashok Rajgopal', department: 'Orthopedics', counter: 'Counter 4', activePatients: 2, status: 'AVAILABLE' },
      { name: 'Dr. S. K. Sarin', department: 'General OPD', counter: 'Counter 5', activePatients: 8, status: 'AVAILABLE' }
    ],
    diagnostics: [
      { type: 'CT_SCAN', activeMachineCount: 2, queueLength: 3, avgTimePerScanMins: 20 },
      { type: 'MRI', activeMachineCount: 1, queueLength: 5, avgTimePerScanMins: 35 },
      { type: 'ULTRASOUND', activeMachineCount: 3, queueLength: 2, avgTimePerScanMins: 15 },
      { type: 'X_RAY', activeMachineCount: 4, queueLength: 1, avgTimePerScanMins: 10 }
    ],
    bloodBank: [
      { group: 'A+', unitsAvailable: 18, lowStockThreshold: 5 },
      { group: 'A-', unitsAvailable: 4, lowStockThreshold: 5 },
      { group: 'B+', unitsAvailable: 25, lowStockThreshold: 5 },
      { group: 'B-', unitsAvailable: 3, lowStockThreshold: 5 },
      { group: 'AB+', unitsAvailable: 12, lowStockThreshold: 5 },
      { group: 'AB-', unitsAvailable: 2, lowStockThreshold: 5 },
      { group: 'O+', unitsAvailable: 30, lowStockThreshold: 5 },
      { group: 'O-', unitsAvailable: 5, lowStockThreshold: 5 }
    ]
  });

  await seed.save();
  return seed;
}

module.exports = {
  getHospitalData,
  updateBedStatus,
  getDoctorLoadBalancing,
  bookDiagnosticScan,
  reserveBloodStock,
  toggleDisasterMode,
  seedHospital
};
