import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import { success, error } from "../utils/response.js";


const COOKIE_NAME = "ir_token";

const cookieOptions = {
  httpOnly: true,                                      // not accessible via JS
  secure:   process.env.NODE_ENV === "production",     // HTTPS only in prod
  sameSite: "strict",
  maxAge:   7 * 24 * 60 * 60 * 1000,                  // 7 days in ms
};
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

// POST /api/auth/register
const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await Admin.findOne({ email });
    if (exists) return error(res, "Admin with this email already exists", 409);
    const imageUrl = req.file ? req.file.path : "";
    const admin = await Admin.create({ name, email, password, imageUrl });
    success(res, {
      admin: { id: admin._id, name: admin.name, email: admin.email, imageUrl: admin.imageUrl },
    }, 201);
  } catch (err) {
    error(res, err.message);
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email, isActive: true }).select("+password");
    if (!admin || !(await admin.comparePassword(password))) {
      return error(res, "Invalid email or password", 401);
    }
    const token = signToken(admin._id);
    res.cookie(COOKIE_NAME, token, cookieOptions);
    success(res, {
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email },
    });
  } catch (err) {
    error(res, err.message);
  }
};

// POST /api/auth/logout
const logout = (_req, res) => {
  res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: 0 });
  success(res, { message: "Logged out successfully" });
};

// GET /api/auth/me
const getMe = (req, res) => {
  success(res, {
    id:    req.admin._id,
    name:  req.admin.name,
    email: req.admin.email,
  });
};

export { createAdmin, login, logout, getMe };