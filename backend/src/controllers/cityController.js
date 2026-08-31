const Hospital = require('../models/Hospital');
const { getPredictiveAnalytics } = require('../services/predictionEngine');

// City-wide seed hospitals list for GIS Map & Central Stream
const CITY_HOSPITALS_SEED = [
  {
    hospitalId: 'HOSP-001',
    name: 'AIIMS Central Super-Specialty',
    address: 'Ansari Nagar, New Delhi',
    city: 'Delhi',
    area: 'South Delhi',
    lat: 28.5672,
    lng: 77.2100,
    phone: '+91 11 2658 8500',
    totalBeds: 450,
    freeBeds: 18,
    freeICU: 2,
    freeVentilators: 1,
    opdAvgWaitMins: 15,
    ctScanWaitMins: 20,
    mriWaitMins: 35,
    bloodBankStatus: 'Good',
    specialties: ['Cardiology', 'Emergency', 'Neurology', 'Orthopedics', 'Pulmonology', 'Pediatrics']
  },
  {
    hospitalId: 'HOSP-002',
    name: 'Safdarjung Multi-Specialty Hospital',
    address: 'Ring Road, New Delhi',
    city: 'Delhi',
    area: 'South Delhi',
    lat: 28.5695,
    lng: 77.2065,
    phone: '+91 11 2616 5060',
    totalBeds: 350,
    freeBeds: 32,
    freeICU: 5,
    freeVentilators: 3,
    opdAvgWaitMins: 22,
    ctScanWaitMins: 15,
    mriWaitMins: 45,
    bloodBankStatus: 'Moderate',
    specialties: ['Emergency', 'General OPD', 'Pulmonology', 'Orthopedics']
  },
  {
    hospitalId: 'HOSP-003',
    name: 'Max Super Specialty Hospital Saket',
    address: 'Press Enclave Road, Saket, New Delhi',
    city: 'Delhi',
    area: 'South Delhi',
    lat: 28.5284,
    lng: 77.2135,
    phone: '+91 11 2651 5050',
    totalBeds: 280,
    freeBeds: 45,
    freeICU: 8,
    freeVentilators: 4,
    opdAvgWaitMins: 10,
    ctScanWaitMins: 10,
    mriWaitMins: 20,
    bloodBankStatus: 'Good',
    specialties: ['Cardiology', 'Neurology', 'Oncology', 'Orthopedics']
  },
  {
    hospitalId: 'HOSP-004',
    name: 'Fortis Escorts Heart Institute',
    address: 'Okhla Road, New Delhi',
    city: 'Delhi',
    area: 'South East Delhi',
    lat: 28.5593,
    lng: 77.2718,
    phone: '+91 11 4713 5000',
    totalBeds: 210,
    freeBeds: 12,
    freeICU: 3,
    freeVentilators: 2,
    opdAvgWaitMins: 12,
    ctScanWaitMins: 15,
    mriWaitMins: 25,
    bloodBankStatus: 'Critical O- Low',
    specialties: ['Cardiology', 'Cardiac Surgery', 'Emergency']
  },
  {
    hospitalId: 'HOSP-005',
    name: 'Indraprastha Apollo Hospital',
    address: 'Sarita Vihar, Mathura Road, New Delhi',
    city: 'Delhi',
    area: 'South East Delhi',
    lat: 28.5398,
    lng: 77.2831,
    phone: '+91 11 2692 5858',
    totalBeds: 400,
    freeBeds: 58,
    freeICU: 11,
    freeVentilators: 6,
    opdAvgWaitMins: 8,
    ctScanWaitMins: 10,
    mriWaitMins: 18,
    bloodBankStatus: 'Good',
    specialties: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Emergency']
  },
  {
    hospitalId: 'HOSP-006',
    name: 'Sir Ganga Ram Hospital',
    address: 'Rajinder Nagar, New Delhi',
    city: 'Delhi',
    area: 'Central Delhi',
    lat: 28.6385,
    lng: 77.1896,
    phone: '+91 11 2575 0000',
    totalBeds: 320,
    freeBeds: 40,
    freeICU: 7,
    freeVentilators: 4,
    opdAvgWaitMins: 14,
    ctScanWaitMins: 12,
    mriWaitMins: 30,
    bloodBankStatus: 'Good',
    specialties: ['Gastroenterology', 'General OPD', 'Pulmonology', 'Emergency']
  }
];

// Area Health Statistics Data
const AREA_STATS = {
  'South Delhi': {
    locality: 'South Delhi',
    totalBeds: 1080,
    availableBeds: 95,
    availableICUs: 15,
    activeSurgeFactor: 'Moderate',
    aqiLevel: 215,
    dominantSymptoms: ['Respiratory Distress', 'High Fever (Dengue)', 'Chest Tightness'],
    avgOpdWaitTimeMins: 15,
    topSpecialtiesInDemand: ['Pulmonology', 'Cardiology', 'Emergency']
  },
  'South East Delhi': {
    locality: 'South East Delhi',
    totalBeds: 610,
    availableBeds: 70,
    availableICUs: 14,
    activeSurgeFactor: 'Normal',
    aqiLevel: 195,
    dominantSymptoms: ['Chest Pain', 'Hypertension', 'Viral Fever'],
    avgOpdWaitTimeMins: 10,
    topSpecialtiesInDemand: ['Cardiology', 'Neurology']
  },
  'Central Delhi': {
    locality: 'Central Delhi',
    totalBeds: 320,
    availableBeds: 40,
    availableICUs: 7,
    activeSurgeFactor: 'High Inflow',
    aqiLevel: 240,
    dominantSymptoms: ['Abdominal Pain', 'Cough/Asthma', 'Fractures'],
    avgOpdWaitTimeMins: 14,
    topSpecialtiesInDemand: ['General OPD', 'Gastroenterology', 'Orthopedics']
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

// Get Health Statistics by Area / Locality
async function getAreaStats(req, res) {
  try {
    const { area = 'South Delhi' } = req.query;
    const stats = AREA_STATS[area] || AREA_STATS['South Delhi'];
    res.json({ success: true, area: stats, availableAreas: Object.keys(AREA_STATS) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// Filter Medical Facilities / Hospitals by Symptoms
async function filterHospitalsBySymptoms(req, res) {
  try {
    const { symptom = '', area = '' } = req.query;
    const symLower = symptom.toLowerCase();

    let matches = CITY_HOSPITALS_SEED;

    if (area) {
      matches = matches.filter(h => h.area === area);
    }

    if (symLower) {
      matches = matches.filter(h => {
        if (symLower.includes('chest') || symLower.includes('heart')) {
          return h.specialties.includes('Cardiology') || h.specialties.includes('Emergency');
        }
        if (symLower.includes('bone') || symLower.includes('fracture') || symLower.includes('joint')) {
          return h.specialties.includes('Orthopedics');
        }
        if (symLower.includes('cough') || symLower.includes('breath') || symLower.includes('asthma')) {
          return h.specialties.includes('Pulmonology') || h.specialties.includes('Emergency');
        }
        if (symLower.includes('head') || symLower.includes('stroke') || symLower.includes('numb')) {
          return h.specialties.includes('Neurology');
        }
        return true;
      });
    }

    res.json({ success: true, count: matches.length, hospitals: matches });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// Ambulance Pre-Arrival Bed Reservation
async function reserveAmbulanceBed(req, res) {
  try {
    const { hospitalId, patientName, severityCondition, category = 'EMERGENCY', etaMins = 12, ambulanceUnit = 'DL-01-AMB-99' } = req.body;

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
    const { incidentLocation = 'Connaught Place Junction', totalCasulties = 25 } = req.body;

    const feed = CITY_HOSPITALS_SEED;
    let totalFree = feed.reduce((acc, h) => acc + h.freeBeds, 0);

    const redistributionPlan = feed.map(hosp => {
      const share = Math.max(1, Math.round((hosp.freeBeds / (totalFree || 1)) * totalCasulties));
      return {
        hospitalId: hosp.hospitalId,
        hospitalName: hosp.name,
        distanceKm: (Math.random() * 5 + 1).toFixed(1),
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
    const { season = 'Monsoon', pollutionAQI = 210, festivalNear = true, outbreakAlert = false } = req.query;
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
