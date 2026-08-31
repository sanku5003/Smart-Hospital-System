const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  tokenNumber: { type: String, required: true },
  hospitalId: { type: String, required: true, default: 'HOSP-001' },
  department: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  actualWaitTimeMins: { type: Number },
  comments: { type: String },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
