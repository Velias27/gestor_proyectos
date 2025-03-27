// /pages/api/login.js
import prisma from "/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error interno al iniciar sesión" });
  }
}
