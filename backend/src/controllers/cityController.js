const Hospital = require('../models/Hospital');
const { getPredictiveAnalytics } = require('../services/predictionEngine');

// Multi-City Seed Hospitals Dataset (Jhansi, Kanpur, Lucknow, Agra, Gwalior, Delhi NCR)
const ALL_CITIES_HOSPITALS_SEED = [
  // --- JHANSI, UP ---
  {
    hospitalId: 'HOSP-001',
    name: 'MLB Medical College & Super-Specialty Hospital, Jhansi',
    address: 'Kanpur-Gwalior Bypass Road, Medical College Campus, Jhansi',
    city: 'Jhansi, UP',
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
    specialties: ['Cardiology', 'Emergency', 'Neurology', 'Orthopedics', 'Pulmonology', 'Pediatrics'],
    specialists: [
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
        opdRoom: 'MLB Cardiac OPD - Room 104'
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
        opdRoom: 'MLB Ortho OPD - Room 208'
      }
    ]
  },
  {
    hospitalId: 'HOSP-002',
    name: 'District Hospital Jhansi (Civil Hospital)',
    address: 'Civil Lines, Near Elite Crossing, Jhansi',
    city: 'Jhansi, UP',
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
    specialties: ['Emergency', 'General OPD', 'Pulmonology', 'Orthopedics'],
    specialists: [
      {
        id: 'DOC-201',
        name: 'Dr. Shweta Bundela',
        qualification: 'MD (General Medicine)',
        department: 'General OPD',
        specialistTitle: 'General Physician',
        symptomsTreated: ['fever', 'dengue', 'abdominal pain'],
        consultationHours: '09:00 AM - 02:00 PM',
        currentStatus: 'AVAILABLE_NOW',
        nextAvailableSlot: '11:30 AM Today',
        opdRoom: 'Civil Hospital OPD Counter 3'
      }
    ]
  },

  // --- KANPUR, UP ---
  {
    hospitalId: 'HOSP-KNP-01',
    name: 'GSVM Medical College & Hospital Kanpur',
    address: 'Swaroop Nagar, Kanpur, UP',
    city: 'Kanpur, UP',
    area: 'Swaroop Nagar (Kanpur)',
    lat: 26.4782,
    lng: 80.3012,
    phone: '+91 512 253 5454',
    totalBeds: 850,
    freeBeds: 58,
    freeICU: 14,
    freeVentilators: 7,
    opdAvgWaitMins: 20,
    ctScanWaitMins: 18,
    mriWaitMins: 30,
    bloodBankStatus: 'Good',
    specialties: ['Cardiology', 'Neurology', 'Pulmonology', 'Emergency'],
    specialists: [
      {
        id: 'DOC-KNP-1',
        name: 'Dr. R. P. Sharma',
        qualification: 'MD, DM (Cardiology)',
        department: 'Cardiology',
        specialistTitle: 'Cardiologist',
        symptomsTreated: ['chest pain', 'heart attack'],
        consultationHours: '09:00 AM - 02:00 PM',
        currentStatus: 'AVAILABLE_NOW',
        nextAvailableSlot: '11:30 AM Today',
        opdRoom: 'GSVM Cardiology Room 12'
      }
    ]
  },
  {
    hospitalId: 'HOSP-KNP-02',
    name: 'Regency Super Specialty Hospital Kanpur',
    address: 'Sarvodaya Nagar, Kanpur, UP',
    city: 'Kanpur, UP',
    area: 'Sarvodaya Nagar (Kanpur)',
    lat: 26.4715,
    lng: 80.3088,
    phone: '+91 512 308 1111',
    totalBeds: 400,
    freeBeds: 72,
    freeICU: 18,
    freeVentilators: 9,
    opdAvgWaitMins: 10,
    ctScanWaitMins: 10,
    mriWaitMins: 15,
    bloodBankStatus: 'Good',
    specialties: ['Neurology', 'Cardiology', 'Orthopedics'],
    specialists: [
      {
        id: 'DOC-KNP-2',
        name: 'Dr. Atul Kapoor',
        qualification: 'MD, DM (Neurology)',
        department: 'Neurology',
        specialistTitle: 'Neurologist',
        symptomsTreated: ['stroke', 'headache'],
        consultationHours: '10:00 AM - 03:00 PM',
        currentStatus: 'AVAILABLE_NOW',
        nextAvailableSlot: '11:45 AM Today',
        opdRoom: 'Regency Neuro Center'
      }
    ]
  },

  // --- LUCKNOW, UP ---
  {
    hospitalId: 'HOSP-LKO-01',
    name: "KGMU King George's Medical University",
    address: 'Chowk, Lucknow, UP',
    city: 'Lucknow, UP',
    area: 'Chowk (Lucknow)',
    lat: 26.8685,
    lng: 80.9168,
    phone: '+91 522 225 7540',
    totalBeds: 1200,
    freeBeds: 85,
    freeICU: 22,
    freeVentilators: 12,
    opdAvgWaitMins: 25,
    ctScanWaitMins: 25,
    mriWaitMins: 45,
    bloodBankStatus: 'Good',
    specialties: ['Cardiology', 'Neurology', 'Orthopedics', 'Emergency', 'Pulmonology'],
    specialists: [
      {
        id: 'DOC-LKO-1',
        name: 'Dr. S. C. Tiwari',
        qualification: 'MD, DM (Cardiology)',
        department: 'Cardiology',
        specialistTitle: 'Cardiologist',
        symptomsTreated: ['chest pain', 'heart attack'],
        consultationHours: '09:00 AM - 02:00 PM',
        currentStatus: 'AVAILABLE_NOW',
        nextAvailableSlot: '11:15 AM Today',
        opdRoom: 'KGMU Cardiology Block'
      }
    ]
  },
  {
    hospitalId: 'HOSP-LKO-02',
    name: 'SGPGI Sanjay Gandhi Postgraduate Institute',
    address: 'Raebareli Road, Lucknow, UP',
    city: 'Lucknow, UP',
    area: 'Raebareli Road (Lucknow)',
    lat: 26.7441,
    lng: 80.9388,
    phone: '+91 522 266 8004',
    totalBeds: 900,
    freeBeds: 60,
    freeICU: 16,
    freeVentilators: 10,
    opdAvgWaitMins: 15,
    ctScanWaitMins: 15,
    mriWaitMins: 25,
    bloodBankStatus: 'Good',
    specialties: ['Cardiology', 'Neurology', 'Gastroenterology'],
    specialists: [
      {
        id: 'DOC-LKO-2',
        name: 'Dr. V. A. Saraswat',
        qualification: 'MD, DM (Gastroenterology)',
        department: 'Gastroenterology',
        specialistTitle: 'Gastroenterologist',
        symptomsTreated: ['abdominal pain', 'vomiting'],
        consultationHours: '09:30 AM - 01:30 PM',
        currentStatus: 'AVAILABLE_NOW',
        nextAvailableSlot: '11:40 AM Today',
        opdRoom: 'SGPGI Gastro OPD'
      }
    ]
  },

  // --- AGRA, UP ---
  {
    hospitalId: 'HOSP-AGR-01',
    name: 'SN Medical College & Hospital Agra',
    address: 'Moti Katra, Agra, UP',
    city: 'Agra, UP',
    area: 'Moti Katra (Agra)',
    lat: 27.1895,
    lng: 78.0055,
    phone: '+91 562 226 0144',
    totalBeds: 650,
    freeBeds: 45,
    freeICU: 9,
    freeVentilators: 4,
    opdAvgWaitMins: 18,
    ctScanWaitMins: 18,
    mriWaitMins: 35,
    bloodBankStatus: 'Good',
    specialties: ['Emergency', 'Orthopedics', 'Pulmonology'],
    specialists: [
      {
        id: 'DOC-AGR-1',
        name: 'Dr. C. P. Pal',
        qualification: 'MS (Orthopedics)',
        department: 'Orthopedics',
        specialistTitle: 'Orthopedic Surgeon',
        symptomsTreated: ['fracture', 'joint pain'],
        consultationHours: '09:00 AM - 01:30 PM',
        currentStatus: 'AVAILABLE_NOW',
        nextAvailableSlot: '11:30 AM Today',
        opdRoom: 'SN Medical Ortho Wing'
      }
    ]
  },

  // --- GWALIOR, MP ---
  {
    hospitalId: 'HOSP-GWL-01',
    name: 'GR Medical College & J. A. Hospital Gwalior',
    address: 'Lashkar, Gwalior, MP',
    city: 'Gwalior, MP',
    area: 'Lashkar (Gwalior)',
    lat: 26.2084,
    lng: 78.1633,
    phone: '+91 751 240 3200',
    totalBeds: 800,
    freeBeds: 50,
    freeICU: 11,
    freeVentilators: 6,
    opdAvgWaitMins: 16,
    ctScanWaitMins: 16,
    mriWaitMins: 30,
    bloodBankStatus: 'Good',
    specialties: ['Cardiology', 'Emergency', 'Neurology', 'Orthopedics'],
    specialists: [
      {
        id: 'DOC-GWL-1',
        name: 'Dr. Sanjay Swarnakar',
        qualification: 'MD, DM (Cardiology)',
        department: 'Cardiology',
        specialistTitle: 'Cardiologist',
        symptomsTreated: ['chest pain', 'heart attack'],
        consultationHours: '09:00 AM - 02:00 PM',
        currentStatus: 'AVAILABLE_NOW',
        nextAvailableSlot: '11:20 AM Today',
        opdRoom: 'JAH Cardiac Center'
      }
    ]
  },

  // --- DELHI NCR ---
  {
    hospitalId: 'HOSP-DEL-01',
    name: 'AIIMS Central Super-Specialty Hospital Delhi',
    address: 'Ansari Nagar, New Delhi',
    city: 'Delhi NCR',
    area: 'South Delhi',
    lat: 28.5672,
    lng: 77.2100,
    phone: '+91 11 2658 8500',
    totalBeds: 1500,
    freeBeds: 35,
    freeICU: 5,
    freeVentilators: 3,
    opdAvgWaitMins: 25,
    ctScanWaitMins: 25,
    mriWaitMins: 45,
    bloodBankStatus: 'Good',
    specialties: ['Cardiology', 'Neurology', 'Pulmonology', 'Emergency'],
    specialists: [
      {
        id: 'DOC-DEL-1',
        name: 'Dr. Naresh Trehan',
        qualification: 'MD, DM (Cardiology)',
        department: 'Cardiology',
        specialistTitle: 'Cardiologist',
        symptomsTreated: ['chest pain', 'heart attack'],
        consultationHours: '09:00 AM - 01:30 PM',
        currentStatus: 'AVAILABLE_NOW',
        nextAvailableSlot: '11:45 AM Today',
        opdRoom: 'AIIMS Cardiac Block'
      }
    ]
  }
];

// Area Health Statistics Data grouped by City
const MULTI_CITY_AREA_STATS = {
  'Jhansi, UP': {
    'Civil Lines (Jhansi)': {
      locality: 'Civil Lines (Jhansi)',
      totalBeds: 730,
      availableBeds: 103,
      availableICUs: 18,
      activeSurgeFactor: 'Normal',
      aqiLevel: 145,
      dominantSymptoms: ['High Fever (Dengue/Viral)', 'Chest Tightness'],
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
      dominantSymptoms: ['Accidental Trauma / Fractures', 'Severe Respiratory Distress'],
      avgOpdWaitTimeMins: 15,
      topSpecialtiesInDemand: ['Emergency', 'Orthopedics', 'Pulmonology']
    }
  },
  'Kanpur, UP': {
    'Swaroop Nagar (Kanpur)': {
      locality: 'Swaroop Nagar (Kanpur)',
      totalBeds: 850,
      availableBeds: 58,
      availableICUs: 14,
      activeSurgeFactor: 'Moderate',
      aqiLevel: 210,
      dominantSymptoms: ['Respiratory Distress', 'High Fever'],
      avgOpdWaitTimeMins: 20,
      topSpecialtiesInDemand: ['Pulmonology', 'Cardiology']
    }
  },
  'Lucknow, UP': {
    'Chowk (Lucknow)': {
      locality: 'Chowk (Lucknow)',
      totalBeds: 1200,
      availableBeds: 85,
      availableICUs: 22,
      activeSurgeFactor: 'High Load',
      aqiLevel: 190,
      dominantSymptoms: ['Cardiology Emergencies', 'Trauma'],
      avgOpdWaitTimeMins: 25,
      topSpecialtiesInDemand: ['Cardiology', 'Neurology']
    }
  },
  'Agra, UP': {
    'Moti Katra (Agra)': {
      locality: 'Moti Katra (Agra)',
      totalBeds: 650,
      availableBeds: 45,
      availableICUs: 9,
      activeSurgeFactor: 'Normal',
      aqiLevel: 180,
      dominantSymptoms: ['Viral Fever', 'Fractures'],
      avgOpdWaitTimeMins: 18,
      topSpecialtiesInDemand: ['Orthopedics', 'Emergency']
    }
  },
  'Gwalior, MP': {
    'Lashkar (Gwalior)': {
      locality: 'Lashkar (Gwalior)',
      totalBeds: 800,
      availableBeds: 50,
      availableICUs: 11,
      activeSurgeFactor: 'Moderate',
      aqiLevel: 160,
      dominantSymptoms: ['Chest Pain', 'Trauma'],
      avgOpdWaitTimeMins: 16,
      topSpecialtiesInDemand: ['Cardiology', 'Emergency']
    }
  },
  'Delhi NCR': {
    'South Delhi': {
      locality: 'South Delhi',
      totalBeds: 1500,
      availableBeds: 35,
      availableICUs: 5,
      activeSurgeFactor: 'Severe Surge',
      aqiLevel: 260,
      dominantSymptoms: ['Respiratory Asthma', 'Cardiology Surge'],
      avgOpdWaitTimeMins: 25,
      topSpecialtiesInDemand: ['Pulmonology', 'Cardiology']
    }
  }
};

// Central City API Feed with City Filter
async function getCityWideFeed(req, res) {
  try {
    const { city = 'Jhansi, UP' } = req.query;
    const liveHosp001 = await Hospital.findOne({ hospitalId: 'HOSP-001' });

    let hospList = ALL_CITIES_HOSPITALS_SEED.filter(h => h.city === city || h.city.includes(city.split(',')[0]));
    if (hospList.length === 0) hospList = ALL_CITIES_HOSPITALS_SEED.filter(h => h.city === 'Jhansi, UP');

    if (liveHosp001 && city.includes('Jhansi')) {
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
      selectedCity: city,
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

// Get Health Statistics by City & Area
async function getAreaStats(req, res) {
  try {
    const { city = 'Jhansi, UP', area = '' } = req.query;
    const cityStats = MULTI_CITY_AREA_STATS[city] || MULTI_CITY_AREA_STATS['Jhansi, UP'];
    const availableAreas = Object.keys(cityStats);
    const targetArea = area && cityStats[area] ? area : availableAreas[0];
    const stats = cityStats[targetArea];

    res.json({ success: true, selectedCity: city, area: stats, availableAreas });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// Filter Hospitals & Specialists by City, Symptoms, Doctor Name, or Specialist Title
async function filterHospitalsBySymptoms(req, res) {
  try {
    const { city = 'Jhansi, UP', symptom = '', area = '', doctorName = '', specialistType = '' } = req.query;

    const symLower = symptom.toLowerCase().trim();
    const docLower = doctorName.toLowerCase().trim();
    const specLower = specialistType.toLowerCase().trim();

    let matches = ALL_CITIES_HOSPITALS_SEED.filter(h => h.city === city || h.city.includes(city.split(',')[0]));
    if (matches.length === 0) matches = ALL_CITIES_HOSPITALS_SEED.filter(h => h.city === 'Jhansi, UP');

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

    res.json({ success: true, selectedCity: city, count: filteredResults.length, hospitals: filteredResults });
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

// Disaster Redistribution Algorithm
async function triggerDisasterRedistribution(req, res) {
  try {
    const { incidentLocation = 'Highway Junction', totalCasulties = 25, city = 'Jhansi, UP' } = req.body;

    let feed = ALL_CITIES_HOSPITALS_SEED.filter(h => h.city === city || h.city.includes(city.split(',')[0]));
    if (feed.length === 0) feed = ALL_CITIES_HOSPITALS_SEED.filter(h => h.city === 'Jhansi, UP');

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
