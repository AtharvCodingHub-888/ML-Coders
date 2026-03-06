import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
// ── Load environment variables ───────────────────────────────────────────
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ───────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Health-check Route ──────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
    res.json({
        status: "ELEARN ML Backend is running natively!",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development",
    });
});

// ── Future API Routes ───────────────────────────────────────────────────
// app.use("/api/auth",  authRoutes);
app.use("/api/users", userRoutes);
// app.use("/api/courses", courseRoutes);

// ── Start Server ────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════╗
║    🚀 ELEARN ML Backend — Running on PORT ${PORT}    ║
║    📡 Health: http://localhost:${PORT}/api/health     ║
╚══════════════════════════════════════════════════╝
    `);
});
