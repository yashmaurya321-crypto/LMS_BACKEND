const Course = require('../model/Course');
const Enrollment = require('../model/Enrollment');
const cloudinary = require('cloudinary').v2;

const createCourse = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      price, 
      level, 
      category, 
      instructor, 
      whoIsThisCourseFor, 
      skills, 
      whatYouWillLearn 
    } = req.body;

    // Safely parse the sections (handle invalid JSON input)
    let sections = [];
    try {
      sections = JSON.parse(req.body.sections); // Safely parse JSON string
    } catch (error) {
      return res.status(400).json({ message: 'Invalid sections format. Please ensure it is a valid JSON string.' });
    }

    // Validate sections and lessons
    sections.forEach(section => {
      if (!section.title) {
        throw new Error('Each section must have a title');
      }
      section.lessons.forEach(lesson => {
        if (!lesson.title) {
          throw new Error('Each lesson must have a title');
        }
        if (!lesson.description) {
          throw new Error('Each lesson must have a description');
        }
        if (!lesson.videoUrl) {
          throw new Error('Each lesson must have a videoUrl');
        }
      });
    });

    // Ensure optional fields are arrays (or set defaults if not provided)
    const parsedWhoIsThisCourseFor = whoIsThisCourseFor ? JSON.parse(whoIsThisCourseFor) : [];
    const parsedSkills = skills ? JSON.parse(skills) : [];
    const parsedWhatYouWillLearn = whatYouWillLearn ? JSON.parse(whatYouWillLearn) : [];

    // Handle thumbnail upload
    let thumbnailUrl = '';
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: 'course_thumbnails',
      });
      thumbnailUrl = uploadResult.secure_url;
    }

    // Create a new course with validated data
    const newCourse = new Course({
      title,
      description,
      price: Number(price), // Ensure price is a number
      thumbnail: thumbnailUrl,
      sections,
      level: level.toLowerCase(),
      category,
      instructor: { name: instructor || 'Unknown Instructor' },
      whoIsThisCourseFor: parsedWhoIsThisCourseFor,
      skills: parsedSkills,
      whatYouWillLearn: parsedWhatYouWillLearn,
    });

    // Save course to the database
    const savedCourse = await newCourse.save();
    res.status(201).json({ message: 'Course created successfully', course: savedCourse });
    
  } catch (error) {
    console.error('Course Creation Error:', error);
    res.status(500).json({ message: 'Failed to create course', error: error.message });
  }
};

// Get all courses
const getAllCourses = async (req, res) => {
    try {
      const courses = await Course.find();
  
      res.status(200).json({ courses });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
// Get course by ID
const getCourseById = async (req, res) => {
    try {
      const { id } = req.params;
      const course = await Course.findById(id)
       
  
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
  
      res.status(200).json({ course });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };

const updateCourse = async (req, res) => {
    try {
      const { id } = req.params;
      const {
        title,
        description,
        price,
        thumbnail,
        instructor,
        duration,
        sectionId,
        level,
        category,
        tags,
      } = req.body;
  
      const updatedCourse = await Course.findByIdAndUpdate(
        id,
        {
          title,
          description,
          price,
          thumbnail,
          instructor,
          duration,
          sectionId,
          level,
          category,
          tags,
        },
        { new: true }
      );
  
      if (!updatedCourse) {
        return res.status(404).json({ message: 'Course not found' });
      }
  
      res.status(200).json({ message: 'Course updated successfully', course: updatedCourse });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };

const deleteCourse = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedCourse = await Course.findByIdAndDelete(id);
  
      if (!deletedCourse) {
        return res.status(404).json({ message: 'Course not found' });
      }
  
      res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  const getEnrolledStudent = async (req, res) => {
    try {
      const { courseId } = req.params;
  console.log(courseId);
      if (!courseId) {
        return res.status(400).json({ error: "Course ID is required." });
      }
  
      const course = await Enrollment.find({ courseId });
  
      const numOfStudents = course.length;
  
      res.status(200).json({ numOfStudents });
    } catch (error) {
      console.error("Error fetching enrolled students:", error);
      res.status(500).json({ error: "An error occurred while fetching enrolled students." });
    }
  };
  
  module.exports = {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    getEnrolledStudent 
  };        