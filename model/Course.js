const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Course description is required']
  },
  price: {
    type: Number,
    required: [true, 'Course price is required']
  },
  thumbnail: {
    type: String,
  },
  duration: {
    type: Number,
  },
  sections: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    lessons: [{
      title: {
        type: String,
        required: true,
        trim: true
      },
      videoUrl: {
        type: String,
      },
      duration: {
        type: Number,
      },
      resources: [{
        type: String,
      }],
    }]
  }],
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  category: {
    type: String,
    required: true
  },
  totalStudents: {
    type: Number,
    default: 0
  },
  whoIsThisCourseFor: [{
    type: String,
  }],
  skills: [{
    type: String,
  }],
  whatYouWillLearn: [{
    type: String,
  }],
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);
