import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import propertyRoutes from "./routes/property.js";
import inventoryRoutes from "./routes/inventory.js";
import uploadRoutes from "./routes/upload.js";
import configRoutes from "./routes/config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// ── Middleware ────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../../uploads")));

// ── Routes ────────────────────────────────────────────
app.use("/api/auth",       authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/inventory",  inventoryRoutes);
app.use("/api/upload",     uploadRoutes);
app.use("/api/config",     configRoutes);

// ── 404 ───────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ status: "ERROR", message: "Route not found" }));

// ── Start ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});