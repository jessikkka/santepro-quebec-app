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

// routes
app.get("/", (req, res) => {
  res.json({ status: "ok" });
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
