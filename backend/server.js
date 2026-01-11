import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 10000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.log("❌ MONGODB_URI est undefined (Render ne l'envoie pas au code)");
}

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB connecté"))
  .catch((err) => console.log("❌ Erreur MongoDB:", err));

app.listen(PORT, () => {
  console.log(`🚀 Serveur SantéPro Québec lancé sur le port ${PORT}`);
});

// =======================
// ROUTES
// =======================

// Route racine (évite "Not Found")
app.get("/", (req, res) => {
  res.json({
    message: "SantéPro Québec API active ✅",
    service: "backend",
    status: "ok",
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    service: "santepro-backend",
    environment: process.env.NODE_ENV || "production",
    status: "healthy"
  });
});

// Exemple route patients (temporaire)
app.get("/api/patients", (req, res) => {
  res.json({
    message: "Liste des patients (placeholder)",
    patients: []
  });
});
// auth routes connected

// =======================
// DATABASE
// =======================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connecté"))
  .catch((err) => console.error("❌ Erreur MongoDB:", err));

// =======================
// SERVER
// =======================
const PORT = process.env.PORT || 10000;


app.listen(PORT, () => {
  console.log(`🚀 Serveur SantéPro Québec lancé sur le port ${PORT}`);
});
