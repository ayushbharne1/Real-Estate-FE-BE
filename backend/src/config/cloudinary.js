import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import { UPLOAD } from "shared/constants/app.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Helper: stream a buffer to Cloudinary ────────────────────
function _uploadBuffer(buffer, options) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (err, result) =>
      err ? reject(err) : resolve(result.secure_url)
    );
    stream.end(buffer);
  });
}

// ── Avatar upload (unchanged) ─────────────────────────────────
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:          "infiniterealty/avatars",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation:  [{ width: 200, height: 200, crop: "fill", gravity: "face", quality: "auto" }],
  },
});

export const uploadAvatar = multer({
  storage:    avatarStorage,
  limits:     { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) =>
    UPLOAD.ALLOWED_IMAGE_TYPES.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error("Only JPEG, PNG, and WebP images are allowed")),
});

// ─────────────────────────────────────────────────────────────
// uploadProperty — combined express middleware array
//
// Accepts multipart fields in ONE request:
//   images[]  → up to IMAGE_MAX_COUNT (10)  JPEG/PNG/WebP  ≤ 10 MB each
//   video     → up to VIDEO_MAX_COUNT  (1)  MP4/WebM/MOV   ≤ 100 MB
//
// After this middleware runs:
//   req.imageUrls  →  string[]        Cloudinary secure URLs (empty array if none)
//   req.videoUrl   →  string | null   Cloudinary secure URL  (null if none)
// ─────────────────────────────────────────────────────────────
const _memUpload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: UPLOAD.VIDEO_MAX_SIZE_BYTES },   // largest cap covers video
  fileFilter(_req, file, cb) {
    const allowed =
      UPLOAD.ALLOWED_IMAGE_TYPES.includes(file.mimetype) ||
      UPLOAD.ALLOWED_VIDEO_TYPES.includes(file.mimetype);
    allowed
      ? cb(null, true)
      : cb(new Error(`Unsupported file type: ${file.mimetype}`));
  },
}).fields([
  { name: "images", maxCount: UPLOAD.IMAGE_MAX_COUNT },
  { name: "video",  maxCount: UPLOAD.VIDEO_MAX_COUNT },
]);

export const uploadProperty = [
  // Step 1 — pull all files into memory
  (req, res, next) => _memUpload(req, res, next),

  // Step 2 — validate + stream to Cloudinary
  async (req, res, next) => {
    try {
      const imageFiles = req.files?.images ?? [];
      const videoFiles = req.files?.video  ?? [];

      // Count guards
      if (imageFiles.length > UPLOAD.IMAGE_MAX_COUNT) {
        return res.status(400).json({
          status: "ERROR",
          message: `Maximum ${UPLOAD.IMAGE_MAX_COUNT} images allowed per property`,
        });
      }
      if (videoFiles.length > UPLOAD.VIDEO_MAX_COUNT) {
        return res.status(400).json({
          status: "ERROR",
          message: `Maximum ${UPLOAD.VIDEO_MAX_COUNT} video allowed per property`,
        });
      }

      // Per-image size guard (individual file check)
      for (const f of imageFiles) {
        if (f.size > UPLOAD.IMAGE_MAX_SIZE_BYTES) {
          return res.status(400).json({
            status: "ERROR",
            message: `Image "${f.originalname}" exceeds the 10 MB limit`,
          });
        }
      }

      // Upload images
      req.imageUrls = await Promise.all(
        imageFiles.map((f) =>
          _uploadBuffer(f.buffer, {
            folder:         "infiniterealty/properties/images",
            resource_type:  "image",
            transformation: [{ width: 1200, crop: "limit", quality: "auto" }],
          })
        )
      );

      // Upload video (if sent)
      req.videoUrl = videoFiles.length
        ? await _uploadBuffer(videoFiles[0].buffer, {
            folder:         "infiniterealty/properties/videos",
            resource_type:  "video",
            transformation: [{ quality: "auto" }],
          })
        : null;

      next();
    } catch (err) {
      next(err);
    }
  },
];

export { cloudinary };