// services/user.service.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const register = async (username, email, password) => {
  const existingUser = await User.findUserByUsernameOrEmail(username, email);
  if (existingUser) {
    throw new Error("Username or email already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const savedUser = await User.createUser(username, email, hashedPassword);
  return savedUser;
};

const login = async (username, email, password) => {
  const user = await User.findUserByUsernameOrEmail(username, email);
  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION || '1h',
  });

  return {
    token,
    user: { id: user.id, username: user.username, email: user.email }
  };
};

const getAllUsers = async () => {
  return await User.findAllUsers();
};

export default {
  register,
  login,
  getAllUsers,
};
