// lib\auth.js
import jwt from "jsonwebtoken";

export function authenticate(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: "No se proporcionó token de autorización" });
    return null;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Token inválido" });
    return null;
  }

  try {
    console.log("Token recibido:", token); // Antes de jwt.verify()
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    res.status(401).json({ error: "Token inválido o expirado" });
    return null;
  }
}
