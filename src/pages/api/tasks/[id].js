// /pages/api/tasks/[id].js
import prisma from "/lib/prisma";
import { authenticate } from "/lib/auth";

export default async function handler(req, res) {
  const user = authenticate(req, res);
  if (!user) return;

  const { id } = req.query;
  const { method, body } = req;

  switch (method) {
    case "GET":
      try {
        const task = await prisma.task.findUnique({
          where: { id },
          include: { assignedUsers: true },
        });
        if (!task) {
          return res.status(404).json({ error: "Tarea no encontrada" });
        }
        return res.status(200).json({ task });
      } catch (error) {
        console.error("Error al obtener la tarea:", error);
        return res.status(500).json({ error: "Error al obtener la tarea" });
      }
    case "PUT":
      try {
        const dataToUpdate = {};
        if (body.title !== undefined) {
          dataToUpdate.title = body.title;
        }
        if (body.assignedUsers !== undefined) {
          dataToUpdate.assignedUsers = {
            set: body.assignedUsers.map((userId) => ({ id: userId })),
          };
        }
        const updatedTask = await prisma.task.update({
          where: { id },
          data: dataToUpdate,
          include: { assignedUsers: true },
        });
        return res.status(200).json({ task: updatedTask });
      } catch (error) {
        console.error("Error al actualizar la tarea:", error);
        return res.status(500).json({ error: "Error al actualizar la tarea" });
      }
    default:
      res.setHeader("Allow", ["GET", "PUT"]);
      return res.status(405).json({ error: `Método ${method} no permitido` });
  }
}
