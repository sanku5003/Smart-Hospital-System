const Hospital = require('../models/Hospital');

// Initialize / Seed Default Jhansi Hospital Data gracefully without duplicate key crashes
async function seedHospital(hospitalId = 'HOSP-001') {
  try {
    // Gracefully handle legacy indexes if existing in MongoDB Atlas
    try {
      const collection = Hospital.collection;
      const indexes = await collection.indexes();
      const legacyCodeIndex = indexes.find(i => i.name === 'code_1');
      if (legacyCodeIndex) {
        console.log('🧹 Dropping legacy `code_1` index from hospitals collection...');
        await collection.dropIndex('code_1');
      }
    } catch (idxErr) {
      // Ignore index drop errors if index doesn't exist
    }

    const existing = await Hospital.findOne({ hospitalId });
    if (existing) {
      return existing;
    }

    const seedData = {
      hospitalId: 'HOSP-001',
      name: 'MLB Medical College & Super-Specialty Hospital, Jhansi',
      address: 'Kanpur-Gwalior Bypass Road, Medical College Campus, Jhansi, UP 284128',
      city: 'Jhansi, UP',
      area: 'Medical College Zone (Jhansi)',
      lat: 25.4385,
      lng: 78.5833,
      phone: '+91 510 232 0808',
      beds: [
        { bedNumber: 'ICU-101', category: 'ICU', status: 'AVAILABLE' },
        { bedNumber: 'ICU-102', category: 'ICU', status: 'OCCUPIED', patientName: 'Ramesh Verma' },
        { bedNumber: 'ICU-103', category: 'ICU', status: 'AVAILABLE' },
        { bedNumber: 'EMG-201', category: 'EMERGENCY', status: 'AVAILABLE' },
        { bedNumber: 'EMG-202', category: 'EMERGENCY', status: 'AVAILABLE' },
        { bedNumber: 'GEN-301', category: 'GENERAL', status: 'OCCUPIED', patientName: 'Sita Devi' },
        { bedNumber: 'GEN-302', category: 'GENERAL', status: 'AVAILABLE' },
        { bedNumber: 'VENT-401', category: 'VENTILATOR', status: 'AVAILABLE' }
      ],
      doctors: [
        {
          id: 'DOC-101',
          name: 'Dr. Prashant Gupta',
          qualification: 'MD, DM (Cardiology), Senior Cardiologist',
          department: 'Cardiology',
          specialistTitle: 'Cardiologist',
          symptomsTreated: ['chest pain', 'heart attack', 'high bp'],
          consultationHours: '09:00 AM - 01:30 PM & 04:00 PM - 07:00 PM',
          currentStatus: 'AVAILABLE_NOW',
          nextAvailableSlot: '11:45 AM Today',
          opdRoom: 'MLB Cardiac OPD - Room 104',
          counter: 'Counter 1 (Cardio)',
          activePatients: 3,
          status: 'AVAILABLE'
        },
        {
          id: 'DOC-102',
          name: 'Dr. P. K. Jain',
          qualification: 'MS (Orthopedics), Joint & Fracture Specialist',
          department: 'Orthopedics',
          specialistTitle: 'Orthopedic Surgeon',
          symptomsTreated: ['fracture', 'bone pain', 'joint pain'],
          consultationHours: '10:00 AM - 02:00 PM',
          currentStatus: 'IN_CONSULTATION',
          nextAvailableSlot: '12:15 PM Today',
          opdRoom: 'MLB Ortho OPD - Room 208',
          counter: 'Counter 2 (Ortho)',
          activePatients: 7,
          status: 'BUSY'
        },
        {
          id: 'DOC-103',
          name: 'Dr. Shweta Bundela',
          qualification: 'MD (General Medicine)',
          department: 'General OPD',
          specialistTitle: 'General Physician',
          symptomsTreated: ['fever', 'dengue', 'abdominal pain'],
          consultationHours: '09:00 AM - 02:00 PM',
          currentStatus: 'AVAILABLE_NOW',
          nextAvailableSlot: '11:30 AM Today',
          opdRoom: 'MLB General OPD Counter 3',
          counter: 'Counter 3 (Gen OPD)',
          activePatients: 1,
          status: 'AVAILABLE'
        }
      ],
      diagnostics: [
        { type: 'CT_SCAN', activeMachineCount: 2, queueLength: 3, avgTimePerScanMins: 15, bookedSlots: [] },
        { type: 'MRI', activeMachineCount: 1, queueLength: 4, avgTimePerScanMins: 30, bookedSlots: [] },
        { type: 'ULTRASOUND', activeMachineCount: 3, queueLength: 2, avgTimePerScanMins: 10, bookedSlots: [] },
        { type: 'X_RAY', activeMachineCount: 4, queueLength: 1, avgTimePerScanMins: 5, bookedSlots: [] }
      ],
      bloodBank: [
        { group: 'A+', unitsAvailable: 18, lowStockThreshold: 5, reservedUnits: 2 },
        { group: 'B+', unitsAvailable: 24, lowStockThreshold: 5, reservedUnits: 1 },
        { group: 'O+', unitsAvailable: 30, lowStockThreshold: 5, reservedUnits: 3 },
        { group: 'AB+', unitsAvailable: 8, lowStockThreshold: 5, reservedUnits: 0 },
        { group: 'O-', unitsAvailable: 3, lowStockThreshold: 5, reservedUnits: 1 }
      ]
    };

    const seeded = await Hospital.findOneAndUpdate(
      { hospitalId: 'HOSP-001' },
      seedData,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log('✅ Seeded MLB Medical College Hospital (HOSP-001)');
    return seeded;
  } catch (err) {
    console.error('⚠️ Warning during seedHospital:', err.message);
    // Return existing record or mock fallback if E11000 index conflict occurs
    const fallback = await Hospital.findOne({ hospitalId: 'HOSP-001' });
    return fallback;
  }
}

// Get Hospital Data
async function getHospitalData(req, res) {
  try {
    const { hospitalId = 'HOSP-001' } = req.params;
    let hospital = await Hospital.findOne({ hospitalId });

    if (!hospital) {
      hospital = await seedHospital(hospitalId);
    }

    res.json({ success: true, hospital });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// Update Bed Status (Hospital Operations Staff)
async function updateBedStatus(req, res) {
  try {
    const { hospitalId = 'HOSP-001' } = req.params;
    const { bedNumber, status, patientName } = req.body;

    let hospital = await Hospital.findOne({ hospitalId });
    if (!hospital) hospital = await seedHospital(hospitalId);

    const bed = hospital.beds.find(b => b.bedNumber === bedNumber);
    if (!bed) {
      return res.status(404).json({ success: false, message: 'Bed not found' });
    }

    bed.status = status;
    if (patientName !== undefined) bed.patientName = patientName;
    if (status === 'OCCUPIED') bed.assignedTime = new Date();
    if (status === 'AVAILABLE') {
      bed.patientName = null;
      bed.isPreAllocatedAmbulance = false;
      bed.ambulanceId = null;
    }

    hospital.lastUpdated = new Date();
    await hospital.save();

    if (req.io) {
      req.io.emit('hospital-updated', { hospitalId, hospital });
    }

    res.json({ success: true, message: `Bed ${bedNumber} status updated to ${status}`, hospital });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// Get Doctor Load Balancing Data
async function getDoctorLoadBalancing(req, res) {
  try {
    const { hospitalId = 'HOSP-001' } = req.params;
    let hospital = await Hospital.findOne({ hospitalId });
    if (!hospital) hospital = await seedHospital(hospitalId);

    res.json({ success: true, doctors: hospital.doctors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// Book Diagnostic Equipment Slot (CT, MRI, USG, X-Ray)
async function bookDiagnosticScan(req, res) {
  try {
    const { hospitalId = 'HOSP-001' } = req.params;
    const { scanType, patientName, timeSlot, tokenNumber } = req.body;

    let hospital = await Hospital.findOne({ hospitalId });
    if (!hospital) hospital = await seedHospital(hospitalId);

    const diag = hospital.diagnostics.find(d => d.type === scanType);
    if (!diag) {
      return res.status(404).json({ success: false, message: 'Diagnostic scanner not found' });
    }

    diag.bookedSlots.push({
      patientName,
      timeSlot,
      tokenNumber,
      status: 'CONFIRMED'
    });
    diag.queueLength += 1;

    await hospital.save();

    if (req.io) {
      req.io.emit('hospital-updated', { hospitalId, hospital });
    }

    res.json({
      success: true,
      message: `${scanType} appointment confirmed for ${patientName} at ${timeSlot}`,
      diagnostic: diag
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// Reserve Blood Stock
async function reserveBloodStock(req, res) {
  try {
    const { hospitalId = 'HOSP-001' } = req.params;
    const { bloodGroup, units = 1 } = req.body;

    let hospital = await Hospital.findOne({ hospitalId });
    if (!hospital) hospital = await seedHospital(hospitalId);

    const bloodItem = hospital.bloodBank.find(b => b.group === bloodGroup);
    if (!bloodItem) {
      return res.status(404).json({ success: false, message: 'Blood group category not found' });
    }

    if (bloodItem.unitsAvailable < units) {
      return res.status(400).json({ success: false, message: `Insufficient units for ${bloodGroup}. Available: ${bloodItem.unitsAvailable}` });
    }

    bloodItem.unitsAvailable -= units;
    bloodItem.reservedUnits += units;

    await hospital.save();

    if (req.io) {
      req.io.emit('hospital-updated', { hospitalId, hospital });
    }

    res.json({
      success: true,
      message: `Reserved ${units} unit(s) of ${bloodGroup}`,
      bloodBank: hospital.bloodBank
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// Toggle Disaster Surge Mode
async function toggleDisasterMode(req, res) {
  try {
    const { hospitalId = 'HOSP-001' } = req.params;
    const { isDisasterSurgeMode } = req.body;

    let hospital = await Hospital.findOne({ hospitalId });
    if (!hospital) hospital = await seedHospital(hospitalId);

    hospital.isDisasterSurgeMode = isDisasterSurgeMode;
    await hospital.save();

    if (req.io) {
      req.io.emit('disaster-mode-toggled', { hospitalId, isDisasterSurgeMode });
      req.io.emit('hospital-updated', { hospitalId, hospital });
    }

    res.json({
      success: true,
      message: `Disaster Surge Mode ${isDisasterSurgeMode ? 'ACTIVATED' : 'DEACTIVATED'} for ${hospital.name}`,
      isDisasterSurgeMode
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  seedHospital,
  getHospitalData,
  updateBedStatus,
  getDoctorLoadBalancing,
  bookDiagnosticScan,
  reserveBloodStock,
  toggleDisasterMode
};
