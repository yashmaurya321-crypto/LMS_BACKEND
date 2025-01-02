const User = require('../model/Users')
const bcrypt = require('bcrypt');
const { generateAccessToken } = require('./AuthController');

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
      
  
      await newUser.save();
      
      
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      // Catch and handle any errors
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  

  const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid password' });
      }
  
      const accessToken = generateAccessToken(user);
  
      res.cookie('token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });
  
      // Send user data (excluding password) along with success message
      const userData = user.toObject();
      delete userData.password;
  console.log("succes");
      res.status(200).json({ 
        message: 'Login successful',
        user: userData
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  const getUser = async (req, res) => {
    try {
      const userId = req.user.userId;
  
      const user = await User.findById(userId)
        .select("-password")
        .populate("enrolledCourses");
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      res.status(200).json({ user });
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({ error: "Server error" });
    }
  };
const uploadProfileImage = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'profile_pictures', // You can change folder name as needed
    });

    // Update the user's profile picture URL in the database
    const user = await User.findByIdAndUpdate(
      userId,
      { image: result.secure_url },  // Save Cloudinary image URL in the 'image' field
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send response with the updated user and image URL
    res.status(200).json({
      message: 'Profile picture updated',
      user: { image: user.image },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to upload profile picture', error: error.message });
  }
};
const logut = (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Ensure secure flag is set in production
      sameSite: "strict",
    });

    // Send success response
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(500).json({ error: "Server error during logout" });
  }
};
module.exports = {
    userRegister,
    loginUser,
    getUser,
    uploadProfileImage,
    logut
}