const User = require('../model/Users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {generateAccessToken, generateRefreshToken} = require("./AuthController");
const sendEmail = require('./EmailController');
const cloudinary = require('cloudinary').v2;
const userRegister = async (req, res) => {
    const { name, email, password } = req.body;
    
    // Logging the request body for debugging purposes
    console.log(req.body);
    
    try {
      // Use findOne to check if the user already exists
      const user = await User.findOne({ email });
      
      // Logging the user result for debugging purposes
      console.log(user);
      
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }
      
      // Generate a salt and hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Create a new user with the hashed password
      const newUser = new User({
        name,
        email,
        password: hashedPassword
      });
      
      // Save the new user to the database
      await newUser.save();
      sendEmail(email, process.env.NODEMAILER_USER, "New User Registered", `New user Registered, name : ${name}, email : ${email}`)
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      // Catch and handle any errors
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  

const loginUser = async (req, res) => {
    const { email, password } = req.body
console.log(email, password)
    const user = await User.findOne({ email }).populate({
      path: 'enrolledCourses',
      populate: {
        path: 'courseId', 
        model: 'Course'
      }
    });
console.log(user)
    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
console.log(isPasswordValid)
    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid password' })
    }
    
    const accessToken = generateAccessToken(user);
   
    res.cookie('token', accessToken, {
      httpOnly: true,
      secure: true,   
      sameSite: 'None',      
    });
  
    
    res.status(200).json({ 
      message: 'Login successful', 
      accessToken ,
      Data : {
        ...user.toObject(), 
        password: undefined,  
    }
    });
}


const rgenerateRefreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) return res.status(401).json({ message: 'Refresh token not provided' });

  jwt.verify(refreshToken, "yash", (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid refresh token' });

    // Generate a new access token
    const accessToken = generateAccessToken({ _id: user.userId, role: user.role });
    res.json({ accessToken });
  });
}

const getUser = async (req, res) => {
  try {
   
    const userId = req.user.userId; 
    

    console.log('User ID:', userId); 

   
    const user = await User.findById(userId)
      .select('-password')
      .populate({
        path: 'enrolledCourses',
        populate: {
          path: 'courseId',
          model: 'Course',
        },
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', user);
    res.status(200).json(user);
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid access token' });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Access token expired' });
    }
    res.status(500).json({ message: err.message });
  }
};

const logut = async (req, res) => {
  res.clearCookie('token', { httpOnly: true,
    secure: false,   
    sameSite: 'lax', });
    console.log('Logout successful')
  res.status(200).json({ message: 'Logout successful' });
}

const uploadProfileImage = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'profile_pictures',
    });

    // Update the user's profile picture URL in the database
    const user = await User.findByIdAndUpdate(
      userId,
      { image: result.secure_url },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Profile picture updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload profile picture', error: error.message });
  }
};

module.exports = {
    userRegister,
    loginUser,
    rgenerateRefreshToken,
getUser,
logut,
uploadProfileImage
}