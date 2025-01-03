const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    image : {
      type : String, 
     
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student'
    },
    profilePicture: String,
    enrolledCourses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Enrollment'
    }]
  }, {
    timestamps: true
  });
  
  

module.exports = mongoose.model('User', userSchema);
