import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { success, error } from "../utils/response.js";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, isActive: true });
    if (!user || !(await user.comparePassword(password))) {
      return error(res, "Invalid email or password", 401);
    }
    const token = signToken(user._id);
    success(res, {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    error(res, err.message);
  }
};

export const getMe = (req, res) => {
  success(res, {
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  });
};