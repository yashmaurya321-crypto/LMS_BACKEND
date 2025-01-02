const express = require('express');
const router = express.Router();
const User = require('../model/Users')
const {loginUser, userRegister,rgenerateRefreshToken,getUser,logut, uploadProfileImage } = require('../controllers/UserController')
const { verifyAccessToken } = require('../controllers/AuthController')
const multer = require('multer');
const path = require('path');

// Configure multer to handle file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Temporary storage location
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Use timestamp as filename
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'), false);
    }
    cb(null, true);
  },
});
router.get('/',verifyAccessToken, getUser)
router.post('/register', userRegister);
router.post('/login', loginUser);
router.post('/upload-profile-image', upload.single('profileImage'), uploadProfileImage);
router.post('/logout', logut);
router.get('/users', verifyAccessToken, async(req, res) => {
    const data = await User.find();
    console.log("all users ",data);
    res.send(data);
});
module.exports = router;