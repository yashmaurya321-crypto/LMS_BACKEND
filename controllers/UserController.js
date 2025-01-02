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
            httpOnly: true, // Prevents JavaScript access to the cookie
            secure: process.env.NODE_ENV === 'production', // Ensures cookies are sent over HTTPS in production
            sameSite: 'Strict', // Prevents CSRF attacks
        });

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    userRegister,
    loginUser
}