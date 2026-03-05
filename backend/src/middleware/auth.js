import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const protect = async (req, res, next) => {
  // Read from httpOnly cookie first, fallback to Authorization header
  const token = req.cookies?.ir_token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ status: "ERROR", message: "Not authorized, no token" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = await Admin.findById(decoded.id);
    if (!req.admin || !req.admin.isActive) {
      return res.status(401).json({ status: "ERROR", message: "Admin not found or inactive" });
    }
    next();
  } catch {
    res.status(401).json({ status: "ERROR", message: "Token invalid or expired" });
  }
};

export { protect };