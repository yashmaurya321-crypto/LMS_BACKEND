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
  thumbnail: String,

  duration: Number,
  sections: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    lessons : [
      {
        title: {
          type: String,
          required: true,
          trim: true
        },
       
        
        videoUrl: String,
        duration: {
          type: Number,
         
          
        },
        resources: [String],  
      }
    ]  
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
  whoIsThisCourseFor: [Array],
  skills: [Array],
  whatYouWillLearn: [Array],
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);
