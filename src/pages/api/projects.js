// /pages/api/projects.js
import prisma from "/lib/prisma";
import { authenticate } from "/lib/auth";

export default async function handler(req, res) {
  const user = authenticate(req, res);
  if (!user) return;
  if (req.method === "GET") {
    try {
      let projects;
      if (user.role === "PROJECT_MANAGER") {
        projects = await prisma.project.findMany({
          where: { userId: user.userId },
          include: { tasks: true },
        });
      } else {
        projects = await prisma.project.findMany({ include: { tasks: true } });
      }
      return res.status(200).json({ projects });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error al obtener proyectos" });
    }
  } else if (req.method === "POST") {
    if (user.role !== "PROJECT_MANAGER") {
      return res
        .status(403)
        .json({ error: "No autorizado para crear proyectos" });
    }
    try {
      const { name } = req.body;
      const newProject = await prisma.project.create({
        data: {
          name,
          userId: user.userId,
        },
      });
      return res.status(201).json({ project: newProject });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error al crear proyecto" });
    }
  } else {
    return res.status(405).json({ error: "Método no permitido" });
  }
}
