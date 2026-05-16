const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const protect = catchAsync(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(new AppError('Invalid or expired token. Please log in again.', 401));
  }

  const user = userModel.findById(decoded.id);
  if (!user) {
    return next(new AppError('The user belonging to this token does no longer exist.', 401));
  }

  req.user = { id: user.id, email: user.email };
  next();
});

module.exports = { protect };
