import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import { UPLOAD } from "shared/constants/app.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Property images ───────────────────────────────────
const propertyStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:          "infiniterealty/properties",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation:  [{ width: 1200, crop: "limit", quality: "auto" }],
  },
});

export const upload = multer({
  storage: propertyStorage,
  limits: { fileSize: UPLOAD.IMAGE_MAX_SIZE_BYTES },
  fileFilter: (_req, file, cb) => {
    UPLOAD.ALLOWED_IMAGE_TYPES.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error("Only JPEG, PNG, and WebP images are allowed"));
  },
});

// ── Admin avatar ──────────────────────────────────────
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:          "infiniterealty/avatars",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation:  [{ width: 200, height: 200, crop: "fill", gravity: "face", quality: "auto" }],
  },
});

export const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 2 * 1024 * 1024 },  // 2 MB max for avatars
  fileFilter: (_req, file, cb) => {
    UPLOAD.ALLOWED_IMAGE_TYPES.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error("Only JPEG, PNG, and WebP images are allowed"));
  },
});

export { cloudinary };