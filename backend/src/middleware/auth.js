import jwt from "jsonwebtoken";

// Utilisation : auth() ou auth(["admin","clinicien"])
export default function auth(roles = []) {
  return (req, res, next) => {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) return res.status(401).json({ message: "Token manquant" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // { id, role }

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Accès refusé" });
      }

      return next();
    } catch (e) {
      return res.status(401).json({ message: "Token invalide" });
    }
  };
}