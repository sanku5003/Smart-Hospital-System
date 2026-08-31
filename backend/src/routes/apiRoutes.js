const express = require('express');
const router = express.Router();

const {
  getHospitalData,
  updateBedStatus,
  getDoctorLoadBalancing,
  bookDiagnosticScan,
  reserveBloodStock,
  toggleDisasterMode
} = require('../controllers/hospitalController');

const {
  createToken,
  checkInToken,
  updateTokenStatus,
  getTokens,
  submitFeedback
} = require('../controllers/tokenController');

const {
  getCityWideFeed,
  getAreaStats,
  filterHospitalsBySymptoms,
  reserveAmbulanceBed,
  triggerDisasterRedistribution,
  getPredictions
} = require('../controllers/cityController');

// Patient & Token Routes
router.post('/tokens/triage', createToken);
router.post('/tokens/checkin', checkInToken);
router.get('/tokens', getTokens);
router.patch('/tokens/:tokenNumber/status', updateTokenStatus);
router.post('/feedback', submitFeedback);

// Hospital Operations Routes
router.get('/hospital/:hospitalId?', getHospitalData);
router.patch('/hospital/:hospitalId?/beds', updateBedStatus);
router.get('/hospital/:hospitalId?/doctors-load', getDoctorLoadBalancing);
router.post('/hospital/:hospitalId?/diagnostics/book', bookDiagnosticScan);
router.post('/hospital/:hospitalId?/blood-bank/reserve', reserveBloodStock);
router.patch('/hospital/:hospitalId?/disaster-mode', toggleDisasterMode);

// Intelligence & City-Wide Routes
router.get('/city/feed', getCityWideFeed);
router.get('/city/area-stats', getAreaStats);
router.get('/city/filter-by-symptoms', filterHospitalsBySymptoms);
router.post('/city/ambulance-reserve', reserveAmbulanceBed);
router.post('/city/disaster-redistribute', triggerDisasterRedistribution);
router.get('/analytics/predictive', getPredictions);

module.exports = router;
