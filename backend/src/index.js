import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import connectDB from "./config/db.js";
import cookieParser  from "cookie-parser";
import authRoutes from "./routes/auth.js";
import propertyRoutes from "./routes/property.js";
import inventoryRoutes from "./routes/inventory.js";
import configRoutes from "./routes/config.js";

const app = express();

// ── Middleware ────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false })); // disabled for Swagger UI
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());
app.use(cookieParser());

// ── Swagger UI ────────────────────────────────────────
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: "InfiniteRealty API Docs",
}));

// ── Routes ────────────────────────────────────────────
app.use("/api/auth",       authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/inventory",  inventoryRoutes);
app.use("/api/config",     configRoutes);

// ── 404 ───────────────────────────────────────────────
app.use((_req, res) =>
  res.status(404).json({ status: "ERROR", message: "Route not found" })
);

// ── Error handler ─────────────────────────────────────
app.use((err, _req, res, _next) => {
  res.status(err.status || 500).json({ status: "ERROR", message: err.message });
});

// ── Start ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Swagger docs → http://localhost:${PORT}/api/docs`);
  });
});

process.on("SIGINT", () => {
  console.log("Shutting down server...");
  app.close(() => {
    process.exit(0);
  });
});