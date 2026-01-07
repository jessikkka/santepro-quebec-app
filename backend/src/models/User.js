import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    motDePasse: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "clinicien", "infirmiere"],
      default: "clinicien"
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);