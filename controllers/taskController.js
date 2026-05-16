const { v4: uuidv4 } = require('uuid');
const taskModel = require('../models/taskModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

// GET /api/tasks — Get all tasks (with optional search, pagination, & sorting)
const getTasks = catchAsync(async (req, res, next) => {
  let tasks = taskModel.getByUser(req.user.id);

  const { search, completed, sort, page = 1, limit = 10 } = req.query;

  // 1) Filtering
  if (search) {
    tasks = tasks.filter((t) =>
      t.title.toLowerCase().includes(search.toLowerCase())
    );
  }
  if (completed !== undefined) {
    const isDone = completed === 'true';
    tasks = tasks.filter((t) => t.completed === isDone);
  }

  // 2) Sorting (Bonus)
  if (sort) {
    // example: ?sort=-createdAt or ?sort=title
    const isDesc = sort.startsWith('-');
    const sortBy = isDesc ? sort.substring(1) : sort;

    tasks.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return isDesc ? 1 : -1;
      if (valA > valB) return isDesc ? -1 : 1;
      return 0;
    });
  } else {
    // Default sort by createdAt descending
    tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  // 3) Pagination
  const start = (page - 1) * limit;
  const paginated = tasks.slice(start, start + Number(limit));

  res.status(200).json({
    status: 'success',
    results: paginated.length,
    total: tasks.length,
    page: Number(page),
    limit: Number(limit),
    data: {
      tasks: paginated,
    }
  });
});

// POST /api/tasks — Create a task
const createTask = catchAsync(async (req, res, next) => {
  const { title, description } = req.body;

  const task = taskModel.create({
    id: uuidv4(),
    userId: req.user.id,
    title,
    description: description || '',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  res.status(201).json({ 
    status: 'success',
    message: 'Task created.', 
    data: { task }
  });
});

// GET /api/tasks/:id — Get single task
const getTask = catchAsync(async (req, res, next) => {
  const task = taskModel.findById(req.params.id);

  if (!task) return next(new AppError('No task found with that ID.', 404));
  if (task.userId !== req.user.id) return next(new AppError('You do not have permission to perform this action.', 403));

  res.status(200).json({
    status: 'success',
    data: { task }
  });
});

// PUT /api/tasks/:id — Update a task
const updateTask = catchAsync(async (req, res, next) => {
  const task = taskModel.findById(req.params.id);

  if (!task) return next(new AppError('No task found with that ID.', 404));
  if (task.userId !== req.user.id) return next(new AppError('You do not have permission to perform this action.', 403));

  const { title, description, completed } = req.body;
  const updated = taskModel.update(req.params.id, {
    ...(title !== undefined && { title }),
    ...(description !== undefined && { description }),
    ...(completed !== undefined && { completed }),
  });

  res.status(200).json({ 
    status: 'success',
    message: 'Task updated.', 
    data: { task: updated }
  });
});

// PATCH /api/tasks/:id/toggle — Toggle completed status
const toggleTask = catchAsync(async (req, res, next) => {
  const task = taskModel.findById(req.params.id);

  if (!task) return next(new AppError('No task found with that ID.', 404));
  if (task.userId !== req.user.id) return next(new AppError('You do not have permission to perform this action.', 403));

  const updated = taskModel.update(req.params.id, { completed: !task.completed });
  res.status(200).json({ 
    status: 'success',
    message: `Task marked as ${updated.completed ? 'completed' : 'incomplete'}.`, 
    data: { task: updated }
  });
});

// DELETE /api/tasks/:id — Delete a task
const deleteTask = catchAsync(async (req, res, next) => {
  const task = taskModel.findById(req.params.id);

  if (!task) return next(new AppError('No task found with that ID.', 404));
  if (task.userId !== req.user.id) return next(new AppError('You do not have permission to perform this action.', 403));

  taskModel.remove(req.params.id);
  res.status(200).json({ 
    status: 'success',
    message: 'Task deleted successfully.',
    data: null
  });
});

module.exports = { getTasks, createTask, getTask, updateTask, toggleTask, deleteTask };
