const catchAsync = require('express-async-handler');
const AppError = require('../utils/appError');
const client = require('../db');
const factory = require('./handlerFactory');
const { skill_add_update } = require('../validators/skillsSchema');

//*********************************************************** */

exports.getSkill = factory.getOne;

exports.getAllSkills = factory.getAll;

exports.deleteSkill = factory.deleteOne;

exports.addSkill = catchAsync(async (req, res, next) => {
  const { error } = skill_add_update.validate(req.body);

  if (error) {
    return next(
      new AppError(error.details.map((err) => err.message).join(', '), 400)
    );
  }
  const { name } = req.body;
  const addSkillQuery = await client.query(
    `INSERT INTO skills (name) VALUES ($1) RETURNING name`,
    [name]
  );

  const addSkill = addSkillQuery.rows[0];

  if (!addSkill) {
    return next(new AppError('Error in creating skill', 400));
  }

  res.status(200).json({
    status: 'success',
    message: 'You have created a skill successfully',
    addSkill,
  });
});

exports.updateSkill = catchAsync(async (req, res, next) => {
  const { error } = skill_add_update.validate(req.body);

  if (error) {
    return next(
      new AppError(
        error.details.map((err) => err.message),
        400
      )
    );
  }

  const skillId = req.params.id;
  const { name } = req.body;

  const updateSkillQuery = await client.query(
    `UPDATE skills SET name = $1 WHERE id = $2 RETURNING name`,
    [name, skillId]
  );

  const skill = updateQuery.rows[0];

  if (!skill) {
    return next(new AppError('Error in updating skill name', 400));
  }

  res.status(200).json({
    status: 'success',
    skill,
  });
});
