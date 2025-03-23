// pages/api/tasks.js
import prisma from "../../lib/prisma";
import { authenticate } from "../../lib/auth";

export default async function handler(req, res) {
  const user = authenticate(req, res);
  if (!user) return;

  if (req.method === "POST") {
    try {
      const { title, projectId } = req.body;
      // Se puede incluir lógica adicional para verificar permisos sobre el proyecto
      const newTask = await prisma.task.create({
        data: { title, projectId },
      });
      return res.status(201).json({ task: newTask });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error al crear tarea" });
    }
  } else {
    return res.status(405).json({ error: "Método no permitido" });
  }
}
