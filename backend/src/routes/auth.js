import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { nom, prenom, email, motDePasse, role } = req.body;

    if (!nom || !prenom || !email || !motDePasse) {
      return res.status(400).json({ message: "Champs manquants" });
    }

    const exist = await User.findOne({ email });
    if (exist) return res.status(409).json({ message: "Email déjà utilisé" });

    const hash = await bcrypt.hash(motDePasse, 10);

    const user = await User.create({
      nom,
      prenom,
      email,
      motDePasse: hash,
      role: role || "clinicien"
    });

    return res.json({
      message: "Utilisateur créé",
      user: {
        id: user._id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role
      }
    });
  } catch (e) {
    return res.status(500).json({ message: "Erreur serveur", error: e.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, motDePasse } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    const ok = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!ok) return res.status(401).json({ message: "Mot de passe invalide" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role
      }
    });
  } catch (e) {
    return res.status(500).json({ message: "Erreur serveur", error: e.message });
  }
});

export default router;