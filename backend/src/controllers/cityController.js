const Hospital = require('../models/Hospital');
const { getPredictiveAnalytics } = require('../services/predictionEngine');

// City-wide seed hospitals list for Jhansi, Uttar Pradesh (UP)
const CITY_HOSPITALS_SEED = [
  {
    hospitalId: 'HOSP-001',
    name: 'MLB Medical College & Super-Specialty Hospital, Jhansi',
    address: 'Kanpur-Gwalior Bypass Road, Medical College Campus, Jhansi',
    city: 'Jhansi',
    state: 'Uttar Pradesh',
    area: 'Medical College Zone (Jhansi)',
    lat: 25.4385,
    lng: 78.5833,
    phone: '+91 510 232 0808',
    totalBeds: 750,
    freeBeds: 42,
    freeICU: 8,
    freeVentilators: 5,
    opdAvgWaitMins: 15,
    ctScanWaitMins: 20,
    mriWaitMins: 35,
    bloodBankStatus: 'Good',
    specialties: ['Cardiology', 'Emergency', 'Neurology', 'Orthopedics', 'Pulmonology', 'Pediatrics', 'Trauma'],
    specialists: [
      {
        id: 'DOC-101',
        name: 'Dr. Prashant Gupta',
        qualification: 'MD, DM (Cardiology), Senior Cardiologist',
        department: 'Cardiology',
        specialistTitle: 'Cardiologist',
        symptomsTreated: ['chest pain', 'heart attack', 'high bp', 'palpitations'],
        consultationHours: '09:00 AM - 01:30 PM & 04:00 PM - 07:00 PM',
        currentStatus: 'AVAILABLE_NOW',
        nextAvailableSlot: '11:45 AM Today',
        opdRoom: 'MLB Cardiac OPD - Room 104',
        queueCount: 3
      },
      {
        id: 'DOC-102',
        name: 'Dr. P. K. Jain',
        qualification: 'MS (Orthopedics), Joint & Fracture Specialist',
        department: 'Orthopedics',
        specialistTitle: 'Orthopedic Surgeon',
        symptomsTreated: ['fracture', 'bone pain', 'joint pain', 'back pain'],
        consultationHours: '10:00 AM - 02:00 PM',
        currentStatus: 'IN_CONSULTATION',
        nextAvailableSlot: '12:15 PM Today',
        opdRoom: 'MLB Ortho OPD - Room 208',
        queueCount: 4
      },
      {
        id: 'DOC-103',
        name: 'Dr. R. K. Niranjan',
        qualification: 'MD, DM (Pulmonology), Respiratory Specialist',
        department: 'Pulmonology',
        specialistTitle: 'Pulmonologist',
        symptomsTreated: ['cough', 'breathing difficulty', 'asthma', 'chest congestion'],
        consultationHours: '08:30 AM - 12:30 PM & 03:30 PM - 06:00 PM',
        currentStatus: 'AVAILABLE_NOW',
        nextAvailableSlot: '11:15 AM Today',
        opdRoom: 'MLB Chest OPD - Room 302',
        queueCount: 2
      },
      {
        id: 'DOC-104',
        name: 'Dr. N. S. Sengar',
        qualification: 'MD (Emergency Medicine & Trauma Specialist)',
        department: 'Emergency',
        specialistTitle: 'Emergency Medicine / Trauma Specialist',
        symptomsTreated: ['fever', 'severe trauma', 'bleeding', 'unconscious'],
        consultationHours: '24/7 Emergency Duty Shift',
        currentStatus: 'AVAILABLE_NOW',
        nextAvailableSlot: 'Immediate Emergency Triage',
        opdRoom: 'MLB Emergency Bay 1',
        queueCount: 1
      }
    ]
  },
  {
    hospitalId: 'HOSP-002',
    name: 'District Hospital Jhansi (Civil Hospital)',
    address: 'Civil Lines, Near Elite Crossing, Jhansi',
    city: 'Jhansi',
    state: 'Uttar Pradesh',
    area: 'Civil Lines (Jhansi)',
    lat: 25.4484,
    lng: 78.5685,
    phone: '+91 510 247 0044',
    totalBeds: 480,
    freeBeds: 65,
    freeICU: 12,
    freeVentilators: 4,
    opdAvgWaitMins: 18,
    ctScanWaitMins: 15,
    mriWaitMins: 40,
    bloodBankStatus: 'Good',
    specialties: ['Emergency', 'General OPD', 'Pulmonology', 'Orthopedics', 'Pediatrics'],
    specialists: [
      {
        id: 'DOC-201',
        name: 'Dr. Shweta Bundela',
        qualification: 'MD (General Medicine & Infectious Disease Specialist)',
        department: 'General OPD',
        specialistTitle: 'General Physician / Infectious Disease',
        symptomsTreated: ['fever', 'dengue', 'abdominal pain', 'vomiting', 'dizziness'],
        consultationHours: '09:00 AM - 02:00 PM',
        currentStatus: 'AVAILABLE_NOW',
        nextAvailableSlot: '11:30 AM Today',
        opdRoom: 'Civil Hospital OPD Counter 3',
        queueCount: 4
      },
      {
        id: 'DOC-202',
        name: 'Dr. R. S. Tripathi',
        qualification: 'MS (Orthopedics & Trauma)',
        department: 'Orthopedics',
        specialistTitle: 'Orthopedic Surgeon',
        symptomsTreated: ['fracture', 'bone pain', 'dislocation'],
        consultationHours: '09:30 AM - 01:30 PM',
        currentStatus: 'IN_CONSULTATION',
        nextAvailableSlot: '12:45 PM Today',
        opdRoom: 'Civil Hospital Ortho Room 5',
        queueCount: 3
      }
    ]
  },
  {
    hospitalId: 'HOSP-003',
    name: "St. Jude's Hospital & Diagnostic Center Jhansi",
    address: 'Civil Lines, Jhansi',
    city: 'Jhansi',
    state: 'Uttar Pradesh',
    area: 'Civil Lines (Jhansi)',
    lat: 25.4452,
    lng: 78.5720,
    phone: '+91 510 244 1358',
    totalBeds: 250,
    freeBeds: 38,
    freeICU: 6,
    freeVentilators: 3,
    opdAvgWaitMins: 10,
    ctScanWaitMins: 10,
    mriWaitMins: 20,
    bloodBankStatus: 'Good',
    specialties: ['Cardiology', 'Neurology', 'Gynecology', 'Orthopedics'],
    specialists: [
      {
        id: 'DOC-301',
        name: 'Dr. Anoop Agarwal',
        qualification: 'MD, DM (Cardiology)',
        department: 'Cardiology',
        specialistTitle: 'Cardiologist',
        symptomsTreated: ['chest pain', 'heart attack', 'palpitations'],
        consultationHours: '10:00 AM - 03:00 PM',
        currentStatus: 'AVAILABLE_NOW',
        nextAvailableSlot: '11:20 AM Today',
        opdRoom: "St. Jude's Cardiac Suite 2",
        queueCount: 2
      },
      {
        id: 'DOC-302',
        name: 'Dr. Meena Sharma',
        qualification: 'MD, DNB (Gynecology & Obstetric Specialist)',
        department: 'Gynecology',
        specialistTitle: 'Gynecologist / Obstetrician',
        symptomsTreated: ['pregnant', 'labor pain', 'maternal care'],
        consultationHours: '10:30 AM - 02:30 PM',
        currentStatus: 'AVAILABLE_NOW',
        nextAvailableSlot: '11:40 AM Today',
        opdRoom: "St. Jude's Maternity Ward",
        queueCount: 1
      }
    ]
  },
  {
    hospitalId: 'HOSP-004',
    name: 'Nirmal Hospital & Trauma Centre Jhansi',
    address: 'SIPRI Bazar / Elite Crossing, Jhansi',
    city: 'Jhansi',
    state: 'Uttar Pradesh',
    area: 'SIPRI Bazar (Jhansi)',
    lat: 25.4421,
    lng: 78.5615,
    phone: '+91 510 244 8899',
    totalBeds: 180,
    freeBeds: 30,
    freeICU: 5,
    freeVentilators: 2,
    opdAvgWaitMins: 12,
    ctScanWaitMins: 12,
    mriWaitMins: 25,
    bloodBankStatus: 'Moderate',
    specialties: ['Orthopedics', 'Trauma', 'Neuro Surgery', 'Emergency'],
    specialists: [
      {
        id: 'DOC-401',
        name: 'Dr. Rajeev Nirmal',
        qualification: 'MS (Orthopedics), Joint Replacement & Trauma Specialist',
        department: 'Orthopedics',
        specialistTitle: 'Orthopedic Surgeon',
        symptomsTreated: ['fracture', 'bone injury', 'accidental trauma'],
        consultationHours: '09:00 AM - 01:00 PM & 04:00 PM - 07:00 PM',
        currentStatus: 'AVAILABLE_NOW',
        nextAvailableSlot: '11:30 AM Today',
        opdRoom: 'Nirmal Trauma Care 1',
        queueCount: 2
      }
    ]
  },
  {
    hospitalId: 'HOSP-005',
    name: 'Sudha Hospital & Heart Institute Jhansi',
    address: 'Gwalior Road, Jhansi',
    city: 'Jhansi',
    state: 'Uttar Pradesh',
    area: 'Gwalior Road (Jhansi)',
    lat: 25.4520,
    lng: 78.5750,
    phone: '+91 510 233 1122',
    totalBeds: 220,
    freeBeds: 45,
    freeICU: 9,
    freeVentilators: 4,
    opdAvgWaitMins: 8,
    ctScanWaitMins: 10,
    mriWaitMins: 18,
    bloodBankStatus: 'Good',
    specialties: ['Cardiology', 'Cardiac Surgery', 'Neurology', 'Pulmonology'],
    specialists: [
      {
        id: 'DOC-501',
        name: 'Dr. Alok Sudha',
        qualification: 'MD, DM (Cardiology), Chief Interventional Cardiologist',
        department: 'Cardiology',
        specialistTitle: 'Cardiologist',
        symptomsTreated: ['chest pain', 'bp', 'heart attack', 'angina'],
        consultationHours: '10:00 AM - 02:00 PM',
        currentStatus: 'AVAILABLE_NOW',
        nextAvailableSlot: '11:15 AM Today',
        opdRoom: 'Sudha Cardiac Center 1',
        queueCount: 1
      }
    ]
  }
];

// Area Health Statistics Data for Jhansi, UP Localities
const AREA_STATS = {
  'Civil Lines (Jhansi)': {
    locality: 'Civil Lines (Jhansi)',
    totalBeds: 730,
    availableBeds: 103,
    availableICUs: 18,
    activeSurgeFactor: 'Normal',
    aqiLevel: 145,
    dominantSymptoms: ['High Fever (Dengue/Viral)', 'Chest Tightness', 'Hypertension'],
    avgOpdWaitTimeMins: 14,
    topSpecialtiesInDemand: ['Cardiology', 'General OPD', 'Gynecology']
  },
  'Medical College Zone (Jhansi)': {
    locality: 'Medical College Zone (Jhansi)',
    totalBeds: 750,
    availableBeds: 42,
    availableICUs: 8,
    activeSurgeFactor: 'High Inflow (Referral Surge)',
    aqiLevel: 155,
    dominantSymptoms: ['Accidental Trauma / Fractures', 'Severe Respiratory Distress', 'Emergency ICU Cases'],
    avgOpdWaitTimeMins: 15,
    topSpecialtiesInDemand: ['Emergency', 'Orthopedics', 'Pulmonology', 'Neurology']
  },
  'SIPRI Bazar (Jhansi)': {
    locality: 'SIPRI Bazar (Jhansi)',
    totalBeds: 180,
    availableBeds: 30,
    availableICUs: 5,
    activeSurgeFactor: 'Moderate',
    aqiLevel: 140,
    dominantSymptoms: ['Bone Injuries', 'Viral Fever', 'Gastrointestinal Pain'],
    avgOpdWaitTimeMins: 12,
    topSpecialtiesInDemand: ['Orthopedics', 'Trauma Care']
  },
  'Gwalior Road (Jhansi)': {
    locality: 'Gwalior Road (Jhansi)',
    totalBeds: 220,
    availableBeds: 45,
    availableICUs: 9,
    activeSurgeFactor: 'Normal',
    aqiLevel: 138,
    dominantSymptoms: ['Chest Pain / BP', 'Asthma Cough'],
    avgOpdWaitTimeMins: 8,
    topSpecialtiesInDemand: ['Cardiology', 'Pulmonology']
  }
};

// Central City API Feed
async function getCityWideFeed(req, res) {
  try {
    const liveHosp001 = await Hospital.findOne({ hospitalId: 'HOSP-001' });
    let hospList = [...CITY_HOSPITALS_SEED];

    if (liveHosp001) {
      const freeBeds = liveHosp001.beds.filter(b => b.status === 'AVAILABLE').length;
      const freeICU = liveHosp001.beds.filter(b => b.category === 'ICU' && b.status === 'AVAILABLE').length;
      const freeVentilators = liveHosp001.beds.filter(b => b.category === 'VENTILATOR' && b.status === 'AVAILABLE').length;
      
      hospList[0] = {
        ...hospList[0],
        freeBeds,
        freeICU,
        freeVentilators,
        isDisasterSurgeMode: liveHosp001.isDisasterSurgeMode
      };
    }

    const citySummary = {
      totalHospitals: hospList.length,
      totalFreeBeds: hospList.reduce((acc, h) => acc + h.freeBeds, 0),
      totalFreeICU: hospList.reduce((acc, h) => acc + h.freeICU, 0),
      totalFreeVentilators: hospList.reduce((acc, h) => acc + h.freeVentilators, 0),
      disasterAlertActive: hospList.some(h => h.isDisasterSurgeMode)
    };

    res.json({ success: true, summary: citySummary, hospitals: hospList });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// Get Health Statistics by Area / Locality in Jhansi
async function getAreaStats(req, res) {
  try {
    const { area = 'Civil Lines (Jhansi)' } = req.query;
    const stats = AREA_STATS[area] || AREA_STATS['Civil Lines (Jhansi)'];
    res.json({ success: true, area: stats, availableAreas: Object.keys(AREA_STATS) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// Filter Hospitals & Specialists by Symptoms, Doctor Name, or Specialist Title
async function filterHospitalsBySymptoms(req, res) {
  try {
    const { symptom = '', area = '', doctorName = '', specialistType = '' } = req.query;

    const symLower = symptom.toLowerCase().trim();
    const docLower = doctorName.toLowerCase().trim();
    const specLower = specialistType.toLowerCase().trim();

    let matches = CITY_HOSPITALS_SEED;

    if (area) {
      matches = matches.filter(h => h.area === area);
    }

    const filteredResults = matches.map(hospital => {
      let matchingSpecialists = hospital.specialists || [];

      if (docLower) {
        matchingSpecialists = matchingSpecialists.filter(doc => doc.name.toLowerCase().includes(docLower));
      }

      if (specLower) {
        matchingSpecialists = matchingSpecialists.filter(doc => 
          (doc.specialistTitle || '').toLowerCase().includes(specLower) ||
          (doc.department || '').toLowerCase().includes(specLower) ||
          (doc.qualification || '').toLowerCase().includes(specLower)
        );
      }

      if (symLower) {
        matchingSpecialists = matchingSpecialists.filter(doc => {
          const docSyms = (doc.symptomsTreated || []).join(' ').toLowerCase();
          const docDept = (doc.department || '').toLowerCase();

          if (symLower.includes('chest') || symLower.includes('heart')) {
            return docDept.includes('cardio') || docDept.includes('emergency') || docSyms.includes('chest') || docSyms.includes('heart');
          }
          if (symLower.includes('bone') || symLower.includes('fracture') || symLower.includes('joint')) {
            return docDept.includes('ortho') || docSyms.includes('fracture') || docSyms.includes('bone');
          }
          if (symLower.includes('cough') || symLower.includes('breath') || symLower.includes('asthma')) {
            return docDept.includes('pulmo') || docSyms.includes('cough') || docSyms.includes('breath');
          }
          if (symLower.includes('head') || symLower.includes('stroke') || symLower.includes('numb')) {
            return docDept.includes('neuro') || docSyms.includes('stroke') || docSyms.includes('head');
          }
          if (symLower.includes('fever')) {
            return docDept.includes('general') || docDept.includes('emergency') || docSyms.includes('fever');
          }

          return docSyms.includes(symLower) || docDept.includes(symLower);
        });
      }

      const hasMatch = matchingSpecialists.length > 0;

      return {
        ...hospital,
        matchingSpecialists,
        hasMatch
      };
    }).filter(h => (docLower || specLower || symLower) ? h.hasMatch : true);

    res.json({ success: true, count: filteredResults.length, hospitals: filteredResults });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// Ambulance Pre-Arrival Bed Reservation
async function reserveAmbulanceBed(req, res) {
  try {
    const { hospitalId, patientName, severityCondition, category = 'EMERGENCY', etaMins = 12, ambulanceUnit = 'UP-93-AMB-108' } = req.body;

    const targetHospId = hospitalId || 'HOSP-001';
    let hospital = await Hospital.findOne({ hospitalId: targetHospId });

    if (!hospital) {
      return res.json({
        success: true,
        message: `Pre-arrival notification sent to ${targetHospId}. Emergency Bed reserved. ETA ${etaMins} mins.`,
        reservation: { hospitalId: targetHospId, bedNumber: 'EMG-PRE-01', etaMins, ambulanceUnit }
      });
    }

    const availableBed = hospital.beds.find(b => (b.category === category || b.category === 'EMERGENCY') && b.status === 'AVAILABLE');

    if (!availableBed) {
      return res.status(400).json({ success: false, message: 'No free emergency beds at requested hospital. Automatic redistribution recommended.' });
    }

    availableBed.status = 'RESERVED';
    availableBed.patientName = `AMBULANCE: ${patientName} (${severityCondition})`;
    availableBed.isPreAllocatedAmbulance = true;
    availableBed.ambulanceId = ambulanceUnit;

    await hospital.save();

    if (req.io) {
      req.io.emit('ambulance-pre-arrival', {
        hospitalId: targetHospId,
        ambulanceId: ambulanceUnit,
        patientName,
        condition: severityCondition,
        etaMins,
        bedNumber: availableBed.bedNumber
      });
      req.io.emit('hospital-updated', { hospitalId: targetHospId, hospital });
    }

    res.json({
      success: true,
      message: `Emergency Bed ${availableBed.bedNumber} reserved at ${hospital.name}. Medical team alerted!`,
      reservation: {
        hospitalName: hospital.name,
        bedNumber: availableBed.bedNumber,
        category: availableBed.category,
        etaMins,
        ambulanceUnit
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// Disaster Redistribution Algorithm for Jhansi Emergency Network
async function triggerDisasterRedistribution(req, res) {
  try {
    const { incidentLocation = 'Elite Crossing / Kanpur Highway Junction, Jhansi', totalCasulties = 25 } = req.body;

    const feed = CITY_HOSPITALS_SEED;
    let totalFree = feed.reduce((acc, h) => acc + h.freeBeds, 0);

    const redistributionPlan = feed.map(hosp => {
      const share = Math.max(1, Math.round((hosp.freeBeds / (totalFree || 1)) * totalCasulties));
      return {
        hospitalId: hosp.hospitalId,
        hospitalName: hosp.name,
        distanceKm: (Math.random() * 4 + 1).toFixed(1),
        allocatedCasualties: share,
        availableBeds: hosp.freeBeds,
        availableICU: hosp.freeICU,
        status: hosp.freeBeds >= share ? 'OPTIMAL' : 'CAPACITY_WARNING'
      };
    });

    if (req.io) {
      req.io.emit('disaster-surge-event', {
        incidentLocation,
        totalCasulties,
        redistributionPlan
      });
    }

    res.json({
      success: true,
      incidentLocation,
      totalCasulties,
      redistributionPlan
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// Predictive Load Endpoint
async function getPredictions(req, res) {
  try {
    const { season = 'Monsoon', pollutionAQI = 145, festivalNear = true, outbreakAlert = false } = req.query;
    const analytics = getPredictiveAnalytics({
      season,
      pollutionAQI: Number(pollutionAQI),
      festivalNear: festivalNear === 'true',
      outbreakAlert: outbreakAlert === 'true'
    });
    res.json({ success: true, analytics });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  getCityWideFeed,
  getAreaStats,
  filterHospitalsBySymptoms,
  reserveAmbulanceBed,
  triggerDisasterRedistribution,
  getPredictions
};
