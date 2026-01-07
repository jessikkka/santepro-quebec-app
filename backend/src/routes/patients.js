import express from "express";
import Patient from "../models/Patient.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/**
 * GET /api/patients
 * Accès: clinicien, infirmiere, admin
 */
router.get("/", auth(["admin", "clinicien", "infirmiere"]), async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    return res.json(patients);
  } catch (e) {
    return res.status(500).json({ message: "Erreur serveur", error: e.message });
  }
});

/**
 * POST /api/patients
 * Accès: clinicien, infirmiere, admin
 */
router.post("/", auth(["admin", "clinicien", "infirmiere"]), async (req, res) => {
  try {
    const { nom, prenom, dateNaissance, telephone, adresse } = req.body;

    if (!nom || !prenom) {
      return res.status(400).json({ message: "Nom et prénom requis" });
    }

    const patient = await Patient.create({
      nom,
      prenom,
      dateNaissance: dateNaissance || "",
      telephone: telephone || "",
      adresse: adresse || "",
      allergies: [],
      diagnostics: [],
      traitements: [],
      notes: []
    });

    return res.json(patient);
  } catch (e) {
    return res.status(500).json({ message: "Erreur serveur", error: e.message });
  }
});

/**
 * GET /api/patients/:id
 * Accès: clinicien, infirmiere, admin
 */
router.get("/:id", auth(["admin", "clinicien", "infirmiere"]), async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient introuvable" });
    return res.json(patient);
  } catch (e) {
    return res.status(500).json({ message: "Erreur serveur", error: e.message });
  }
});

/**
 * POST /api/patients/:id/notes
 * Accès: clinicien, infirmiere, admin
 */
router.post("/:id/notes", auth(["admin", "clinicien", "infirmiere"]), async (req, res) => {
  try {
    const { contenu } = req.body;
    if (!contenu) return res.status(400).json({ message: "Contenu requis" });

    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient introuvable" });

    patient.notes.push({
      auteur: req.user.id,
      contenu
    });

    await patient.save();
    return res.json(patient);
  } catch (e) {
    return res.status(500).json({ message: "Erreur serveur", error: e.message });
  }
});

export default router;