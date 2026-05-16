const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  getTasks,
  createTask,
  getTask,
  updateTask,
  toggleTask,
  deleteTask,
} = require('../controllers/taskController');

// All routes are protected
router.use(protect);

router.get('/', getTasks);

router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required for a task.'),
    body('description').optional().trim(),
    validate
  ],
  createTask
);

router.get('/:id', getTask);

router.put(
  '/:id',
  [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty if provided.'),
    body('description').optional().trim(),
    body('completed').optional().isBoolean().withMessage('Completed status must be a boolean.'),
    validate
  ],
  updateTask
);

router.patch('/:id/toggle', toggleTask);

router.delete('/:id', deleteTask);

module.exports = router;
