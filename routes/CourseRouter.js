const express = require('express');
const router = express.Router();
const {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse, 
} = require('../controllers/CourseController')
const { verifyAccessToken } = require('../controllers/AuthController')
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
// Route to create a course
router.post('/courses', createCourse);

// Route to get all courses
router.get('/courses', getAllCourses);

// Route to get a course by its ID
router.get('/courses/:id', getCourseById);

// Route to update a course by its ID
router.put('/courses/:id', updateCourse);

// Route to delete a course by its ID
router.delete('/courses/:id', deleteCourse);

module.exports = router;
