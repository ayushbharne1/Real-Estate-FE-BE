import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import { success, error } from "../utils/response.js";

const COOKIE_NAME = "ir_token";

const cookieOptions = {
  httpOnly: true,
  secure:   process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge:   7 * 24 * 60 * 60 * 1000,
};

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

const adminPayload = (admin) => ({
  id:       admin._id,
  userName: admin.userName,
  email:    admin.email,
  imageUrl: admin.imageUrl ?? null,
});

export const createAdmin = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    const exists = await Admin.findOne({ $or: [{ email }, { userName }] });
    if (exists) {
      const field = exists.email === email ? "email" : "userName";
      return error(res, `Admin with this ${field} already exists`, 409);
    }
    const imageUrl = req.file?.path ?? null;  // Cloudinary URL if image uploaded
    const admin = await Admin.create({ userName, email, password, imageUrl });
    success(res, { admin: adminPayload(admin) }, 201);
  } catch (err) {
    error(res, err.message);
  }
};

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const isEmail = identifier.includes("@");
    const query   = isEmail
      ? { email: identifier.toLowerCase(), isActive: true }
      : { userName: identifier,            isActive: true };
    const admin = await Admin.findOne(query).select("+password");
    if (!admin || !(await admin.comparePassword(password))) {
      return error(res, "Invalid credentials", 401);
    }
    const token = signToken(admin._id);
    res.cookie(COOKIE_NAME, token, cookieOptions);
    success(res, { admin: adminPayload(admin), token });
  } catch (err) {
    error(res, err.message);
  }
};

export const logout = (_req, res) => {
  res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: 0 });
  success(res, { message: "Logged out successfully" });
};

export const getMe = (req, res) => {
  success(res, adminPayload(req.admin));
};