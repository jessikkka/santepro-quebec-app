import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// ✅ PORT déclaré UNE SEULE FOIS
const PORT = process.env.PORT || 10000;
// --------------------
// ROUTES API (public)
// --------------------

// Version / Info
app.get("/api/info", (req, res) => {
  res.json({
    name: "SantePro Quebec API",
    version: "0.1.0",
    env: process.env.NODE_ENV || "development",
  });
});

// Statut simple
app.get("/api/status", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});
// routes
app.get("/", (req, res) => {
  res.json({ status: "ok" });
});
app.get("/api/health", (req, res) => {
  res.json({
    service: "SantePro Quebec API",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});
// MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connecté"))
  .catch(err => console.error("❌ MongoDB erreur:", err));

// server
app.listen(PORT, () => {
  console.log(`🚀 Serveur SantéPro Québec lancé sur le port ${PORT}`);
});
