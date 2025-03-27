// pages/api/users.js
import prisma from "/lib/prisma";
import { authenticate } from "/lib/auth";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  const authUser = authenticate(req, res);
  if (!authUser) return;

  if (authUser.role !== "ADMIN") {
    return res.status(403).json({ error: "No autorizado" });
  }

  if (req.method === "POST") {
    try {
      const { name, email, password, role } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role,
        },
      });
      return res.status(201).json({ user: newUser });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error al crear usuario" });
    }
  } else if (req.method === "GET") {
    try {
      const users = await prisma.user.findMany();
      return res.status(200).json({ users });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error al obtener usuarios" });
    }
  } else {
    return res.status(405).json({ error: "Método no permitido" });
  }
}
