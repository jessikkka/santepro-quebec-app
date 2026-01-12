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
// --------------------
// JWT Middleware
// --------------------
function requireAuth(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
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
// Auth demo (génère un token)
app.get("/api/auth/demo-login", (req, res) => {
  const user = { id: "demo-user", role: "admin" };
  const token = jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });

  res.json({ token });
});

// Route protégée
app.get("/api/private", requireAuth, (req, res) => {
  res.json({
    message: "Accès autorisé",
    user: req.user,
  });
});
