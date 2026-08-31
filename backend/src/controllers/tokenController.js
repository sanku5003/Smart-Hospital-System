const Token = require('../models/Token');
const Feedback = require('../models/Feedback');
const { triageSymptoms } = require('../services/geminiService');

// Create token with AI Triage & Priority Scoring
async function createToken(req, res) {
  try {
    const {
      hospitalId = 'HOSP-001',
      patientName,
      phone,
      age = 30,
      gender = 'Other',
      isPregnant = false,
      symptoms,
      language = 'English'
    } = req.body;

    if (!patientName || !phone || !symptoms) {
      return res.status(400).json({ success: false, message: 'Patient Name, Phone, and Symptoms are required.' });
    }

    // 1. Perform AI Triage & Severity Scoring
    const aiResult = await triageSymptoms({ symptoms, age, gender, isPregnant, language });

    // 2. Generate priority prefix & unique sequence
    const count = await Token.countDocuments({ hospitalId });
    const sequence = (count + 1).toString().padStart(3, '0');

    let prefix = 'GEN';
    if (aiResult.triageCategory === 'EMERGENCY') prefix = 'EMG';
    else if (aiResult.triageCategory === 'VULNERABLE') prefix = 'VUL';

    const tokenNumber = `${prefix}-${sequence}`;

    // 3. Estimate wait time based on priority
    let estimatedWaitMins = 15;
    if (aiResult.triageCategory === 'EMERGENCY') estimatedWaitMins = 0; // Immediate
    else if (aiResult.triageCategory === 'VULNERABLE') estimatedWaitMins = 8;

    // 4. Construct Token Record
    const token = new Token({
      tokenNumber,
      hospitalId,
      patientName,
      phone,
      age: Number(age),
      gender,
      symptoms,
      language,
      triageCategory: aiResult.triageCategory,
      severityScore: aiResult.severityScore,
      department: aiResult.department,
      assignedCounter: aiResult.triageCategory === 'EMERGENCY' ? 'Emergency Desk 1' : 'Counter ' + ((count % 4) + 1),
      assignedDoctor: aiResult.department === 'Cardiology' ? 'Dr. Naresh Trehan' : 'Dr. V. K. Paul',
      estimatedWaitMins,
      qrCodeData: JSON.stringify({ tokenNumber, hospitalId, patientName, date: new Date().toISOString() }),
      aiGuidance: {
        urgencyLevel: aiResult.urgencyLevel,
        recommendedAction: aiResult.recommendedAction,
        whatToBring: aiResult.whatToBring,
        govtSchemeNote: aiResult.govtSchemeNote
      }
    });

    await token.save();

    // 5. Realtime Socket Broadcast
    if (req.io) {
      req.io.emit('token-created', token);
      req.io.emit('queue-updated', { hospitalId });
    }

    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// QR Code Check-In
async function checkInToken(req, res) {
  try {
    const { tokenNumber } = req.body;
    const token = await Token.findOne({ tokenNumber });

    if (!token) return res.status(404).json({ success: false, message: 'Token not found' });

    token.checkedIn = true;
    token.checkInTime = new Date();
    await token.save();

    if (req.io) req.io.emit('patient-checked-in', { tokenNumber, checkInTime: token.checkInTime });

    res.json({ success: true, message: `Check-in successful for Token ${tokenNumber}`, token });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// Update Token Status
async function updateTokenStatus(req, res) {
  try {
    const { tokenNumber } = req.params;
    const { status } = req.body;

    const token = await Token.findOne({ tokenNumber });
    if (!token) return res.status(404).json({ success: false, message: 'Token not found' });

    token.status = status;
    await token.save();

    if (req.io) {
      req.io.emit('token-status-changed', { tokenNumber, status });
      req.io.emit('queue-updated', { hospitalId: token.hospitalId });
    }

    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// Get Priority Ordered Queue
async function getTokens(req, res) {
  try {
    const { hospitalId = 'HOSP-001' } = req.query;

    const tokens = await Token.find({ hospitalId }).sort({
      // Sort rule: Emergency (1) -> Vulnerable (2) -> General (3), then higher severity score first, then earliest created
      triageCategory: 1, // 'EMERGENCY' < 'GENERAL' in alphabetical order? Let's fix custom sort
      createdAt: 1
    });

    // Custom sorting function for strict clinical priority
    tokens.sort((a, b) => {
      const priorityOrder = { EMERGENCY: 1, VULNERABLE: 2, GENERAL: 3 };
      if (priorityOrder[a.triageCategory] !== priorityOrder[b.triageCategory]) {
        return priorityOrder[a.triageCategory] - priorityOrder[b.triageCategory];
      }
      if (b.severityScore !== a.severityScore) {
        return b.severityScore - a.severityScore; // Higher severity first
      }
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

    res.json({ success: true, count: tokens.length, tokens });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// Submit Post-Visit Feedback
async function submitFeedback(req, res) {
  try {
    const { tokenNumber, hospitalId = 'HOSP-001', department, rating, actualWaitTimeMins, comments } = req.body;

    const feedback = new Feedback({
      tokenNumber,
      hospitalId,
      department: department || 'General OPD',
      rating: Number(rating),
      actualWaitTimeMins: Number(actualWaitTimeMins),
      comments
    });

    await feedback.save();

    res.json({ success: true, feedback, message: 'Thank you for your feedback!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  createToken,
  checkInToken,
  updateTokenStatus,
  getTokens,
  submitFeedback
};
