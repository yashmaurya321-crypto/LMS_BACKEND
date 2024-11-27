const express = require('express');
const router = express.Router();
const {
  createSections,  
  getSections,
  getSectionById,
  updateSection,
  deleteSection
} = require('../controllers/SectionController');


router.post('/sections', createSections);
router.get('/sections', getSections);
router.get('/sections/:id', getSectionById);
router.put('/sections/:id', updateSection);
router.delete('/sections/:id', deleteSection);

module.exports = router;
