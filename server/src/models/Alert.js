const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  ip: {
    type: String,
    required: true,
  },
  event: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Authentication', 'API', 'Network', 'Security', 'Performance'],
    required: true,
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    required: true,
  },
  status: {
    type: String,
    enum: ['Blocked', 'Flagged', 'Monitoring', 'Resolved'],
    default: 'Flagged',
  },
  aiAnalysis: {
    type: String,
    default: '',
  },
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);