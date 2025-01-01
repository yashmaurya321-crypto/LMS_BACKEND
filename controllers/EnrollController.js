const Enrollment = require('../model/Enrollment');
const User = require('../model/Users');
const Course = require('../model/Course');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const sendEmail = require('./EmailController');
require('dotenv').config();
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, 
  key_secret: process.env.RAZORPAY_KEY_SECRET, 
});

const createEnrollment = async (req, res) => {
  try {
    const { courseId, amount } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(400).json({ message: 'Course not found' });
    }

    const options = {
      amount, // in paise
      currency: 'INR',
      receipt: `receipt_${new Date().getTime()}`,
      notes: {
        courseId,
      },
    };

    const order = await razorpayInstance.orders.create(options);

    res.json({
      orderId: order.id,
      amount,
      currency: 'INR',
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Error in creating Razorpay order: ', error);
    res.status(500).json({ message: 'Error in creating Razorpay order' });
  }
}

const verifyEnrollment = async (req, res) => {
  try {
    const { courseId, paymentId, orderId, signature } = req.body;

    // Verify payment signature
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto.createHmac('sha256', "xCBMeuExbvKRmUikrN8AVOo2")
                                      .update(body)
                                      .digest('hex');

    if (signature !== expectedSignature) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    
    const user = await User.findById(req.user.userId);  // Make sure user is fetched from DB

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(400).json({ message: 'Course not found' });
    }

    // Create an enrollment record
    const enrollment = new Enrollment({
      userId: user._id,
      courseId: course._id,
      status: 'active',
    });

    await enrollment.save();

    // Check if 'enrolledCourses' array exists, if not, initialize it
    if (!user.enrolledCourses) {
      user.enrolledCourses = [];
    }

    // Add course to user's enrolled courses
    user.enrolledCourses.push(enrollment._id);
    await user.save();
sendEmail(user.email, process.env.NODEMAILER_USER, "New Enrollment",  ` New Enrollment Details
    User: ${user.name}
    Course: ${course.title}
` )
sendEmail(process.env.NODEMAILER_USER, user.email, "Successful Enrollment", `You have SuccessFully enrolled to ${course.title}`)
    res.status(201).json({ message: 'Payment successful and enrollment completed' });
  } catch (error) {
    console.error('Error in payment verification or enrollment: ', error);
    res.status(500).json({ message: 'Error in payment verification or enrollment' });
  }
}




module.exports = {
  createEnrollment,
 verifyEnrollment
};
