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

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Generate access token
        const accessToken = generateAccessToken(user);

        res.cookie('token', accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
          sameSite: 'Strict', // Or 'Lax' if integrating third-party APIs
      });

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getUser = async (req, res) => {
  try {
    // Extract user ID from `req.user`
    const userId = req.user.userId;

    // Find the user by ID, exclude the password field, and populate `enrolledCourses`
    const user = await User.findById(userId)
      .select("-password") // Exclude the password field
      .populate("enrolledCourses"); // Populate `enrolledCourses`

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
    userRegister,
    loginUser,
    getUser
}