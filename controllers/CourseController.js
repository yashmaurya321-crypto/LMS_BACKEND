const Course = require('../model/Course')
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

    let sections = [];
    try {
      sections = JSON.parse(req.body.sections); // Safely parse JSON string
    } catch (error) {
      return res.status(400).json({ message: 'Invalid sections format' });
    }

    console.log(req.body);

    // Validate that sections and lessons contain required fields
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

    // Ensure optional fields are arrays (or set defaults)
    const parsedWhoIsThisCourseFor = whoIsThisCourseFor ? JSON.parse(whoIsThisCourseFor) : [];
    const parsedSkills = skills ? JSON.parse(skills) : [];
    const parsedWhatYouWillLearn = whatYouWillLearn ? JSON.parse(whatYouWillLearn) : [];

    let thumbnailUrl = '';
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: 'course_thumbnails',
      });
      thumbnailUrl = uploadResult.secure_url;
    }

    const newCourse = new Course({
      title,
      description,
      price: Number(price),
      thumbnail: thumbnailUrl,
      sections,
      level: level.toLowerCase(),
      category,
      instructor: { name: instructor || 'Unknown Instructor' },
      whoIsThisCourseFor: parsedWhoIsThisCourseFor,
      skills: parsedSkills,
      whatYouWillLearn: parsedWhatYouWillLearn,
    });

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
  module.exports = {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
  };        