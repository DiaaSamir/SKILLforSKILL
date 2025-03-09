const express = require('express');
const skillsController = require('../controllers/skillsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect, authController.restrictTo('Admin'));
router.route('/').get(skillsController.getAllSkills);

router
  .route('/:id')
  .patch(skillsController.updateSkill)
  .delete(skillsController.deleteSkill)
  .get(skillsController.getSkill);

module.exports = router;
