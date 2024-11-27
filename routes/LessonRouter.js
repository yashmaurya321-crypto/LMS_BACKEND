const express = require('express');
const router = express.Router();

const {createLessons, getLessons} = require('../controllers/LessonController')

router.post('/create', createLessons)
router.post('/get', getLessons)
module.exports = router;