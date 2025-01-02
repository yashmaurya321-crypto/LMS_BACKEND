const express = require('express');
const router = express.Router();
const {  verifyEnrollment, createEnrollment   } = require('../controllers/EnrollController')
const { verifyAccessToken } = require('../controllers/AuthController')
router.post('/createEnrollment', createEnrollment);

router.post('/verifyEnrollment', verifyEnrollment);


module.exports = router