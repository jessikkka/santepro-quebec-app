import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    auteur: { type: String, required: true },
    contenu: { type: String, required: true }
  },
  { timestamps: true }
);

const patientSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    dateNaissance: { type: String },
    telephone: { type: String },
    adresse: { type: String },

    allergies: [String],
    diagnostics: [String],
    traitements: [String],

    notes: [noteSchema]
  },
  { timestamps: true }
);

export default mongoose.model("Patient", patientSchema);