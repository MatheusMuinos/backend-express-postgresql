// controllers/user.controller.js
import userService from '../services/user.service.js';

const register = async (req, res) => {
  const { username, email, password } = req.body;
  console.log("Registering user", req.body);

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Username, email, and password are required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ 
      message: "Password must be at least 8 characters long and include at least one letter and one number" 
    });
  }

  try {
    const user = await userService.register(username, email, password);
    return res.status(200).json({ message: 'User registered successfully', username: user.username });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  const { username, email, password } = req.body;
  console.log("Logging in user", req.body);

  if (!password || (!username && !email)) {
    return res.status(400).json({ message: "Username or email and password are required" });
  }

  try {
    const { token, user } = await userService.login(username, email, password);
    return res.status(200).json({ message: 'Login successful', token, user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default { register, login, getAllUsers };
