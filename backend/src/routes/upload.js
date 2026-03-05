import { Router } from "express";
import multer from "multer";
import path from "path";
import { protect } from "../middleware/auth.js";
import { success, error } from "../utils/response.js";
import { UPLOAD } from "shared/constants";

const router = Router();
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (_req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, "_")}`),
});

const upload = multer({
  storage,
  limits: { fileSize: UPLOAD.IMAGE_MAX_SIZE_BYTES },
  fileFilter: (_req, file, cb) => {
    UPLOAD.ALLOWED_IMAGE_TYPES.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error("Only JPEG, PNG, and WebP images are allowed"));
  },
});

router.post("/images", protect, upload.array("images", UPLOAD.IMAGE_MAX_COUNT), (req, res) => {
  try {
    const urls = req.files.map((f) => `/uploads/${f.filename}`);
    success(res, urls);
  } catch (err) {
    error(res, err.message);
  }
});

export default router;