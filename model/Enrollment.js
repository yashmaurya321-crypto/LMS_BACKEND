const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'expired'],
    default: 'active'
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  completedLessons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  }],
  certificateIssued: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);
