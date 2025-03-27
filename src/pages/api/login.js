import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

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
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    // Simulación de token
    const token = "fake-token";

    // Normalizamos el role para usarlo en el frontend
    const normalizedRole = user.role.toLowerCase();

    res.status(200).json({
      token,
      user: {
        name: user.name,
        email: user.email,
        role:
          normalizedRole.includes("manager")
            ? "manager"
            : normalizedRole.includes("team")
            ? "member"
            : "admin",
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}