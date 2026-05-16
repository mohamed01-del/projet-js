const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const userModel = require('../models/userModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (userModel.findByEmail(email)) {
    return next(new AppError('Email already registered.', 409));
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = userModel.create({
    id: uuidv4(),
    name,
    email,
    password: hashedPassword,
    createdAt: new Date().toISOString(),
  });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(201).json({
    status: 'success',
    message: 'User registered successfully.',
    token,
    data: {
      user: { id: user.id, name: user.name, email: user.email }
    }
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = userModel.findByEmail(email);
  if (!user) {
    return next(new AppError('Incorrect email or password.', 401));
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new AppError('Incorrect email or password.', 401));
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(200).json({
    status: 'success',
    message: 'Login successful.',
    token,
    data: {
      user: { id: user.id, name: user.name, email: user.email }
    }
  });
});

module.exports = { register, login };
