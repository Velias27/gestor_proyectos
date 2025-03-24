// pages/api/tasks/[id].js
import prisma from "../../../lib/prisma";
import { authenticate } from "../../../lib/auth";

export default async function handler(req, res) {
  const authUser = authenticate(req, res);
  if (!authUser) return;

  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const task = await prisma.task.findUnique({ where: { id } });
      if (!task) return res.status(404).json({ error: "Tarea no encontrada" });
      return res.status(200).json({ task });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error al obtener tarea" });
    }
  } else if (req.method === "PUT") {
    const { title, completed, assignedTo } = req.body;

    if (assignedTo && authUser.role !== "PROJECT_MANAGER") {
      return res
        .status(403)
        .json({ error: "No autorizado para asignar tareas" });
    }

    try {
      const updatedTask = await prisma.task.update({
        where: { id },
        data: {
          title,
          completed,
          assignedTo,
        },
      });
      return res.status(200).json({ task: updatedTask });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error al actualizar tarea" });
    }
  } else if (req.method === "DELETE") {
    try {
      const deletedTask = await prisma.task.delete({ where: { id } });
      return res.status(200).json({ task: deletedTask });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error al eliminar tarea" });
    }
  } else {
    return res.status(405).json({ error: "Método no permitido" });
  }
}
