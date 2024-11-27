const jwt = require('jsonwebtoken')

require('dotenv').config();

const verifyAccessToken =  (req, res, next) => {
  try {
       
    const token = req.cookies.token;
      
      if (!token) {
          return res.status(401).json({ error: "Please log in to access" });
      }

      try {
          const decodedData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
          
          if (!decodedData.userId) {
              return res.status(403).json({ error: "Invalid token" });
          }
          
          req.user = { userId: decodedData.userId, role: decodedData.role };
          next();
      } catch (verifyError) {
          console.error('Token verification failed:', verifyError);
          return res.status(403).json({ error: "Invalid token" });
      }
  } catch (error) {
      console.log('error : ', error);
      return res.status(403).json({ error: "Forbidden" });
  }
};


const generateAccessToken = (user) => {
    return jwt.sign({ userId: user._id, role : user.role }, process.env.ACCESS_TOKEN_SECRET);
  };  
 

  module.exports = {
    verifyAccessToken,
    generateAccessToken,
    
  }