// /pages/api/tasks/updateTask.js

import prisma from "/lib/prisma";
import { authenticate } from "/lib/auth";

export default async function handler(req, res) {
  const user = authenticate(req, res); // Verificar si el usuario está autenticado
  if (!user) return res.status(401).json({ error: "No autenticado" });  // Retornar 401 si no está autenticado

  const { taskId } = req.query; // ID de la tarea que vamos a actualizar
  const { method, body } = req; // Extraemos el método y el cuerpo de la solicitud

  console.log("Usuario autenticado:", user); // Log para ver el usuario autenticado

  switch (method) {
    case "PUT":
      try {
        // Asegurarnos de que el nuevo estado está presente
        if (!body.status) {
          return res.status(400).json({ error: "El estado de la tarea es requerido" });
        }

        // Validación del estado de la tarea
        const validStatuses = ["PENDING", "IN_PROGRESS", "BLOCKED", "COMPLETED"];
        if (!validStatuses.includes(body.status)) {
          return res.status(400).json({ error: "Estado inválido de tarea" });
        }

        // Obtener la tarea para verificar si está asignada al usuario
        const task = await prisma.task.findUnique({
          where: { id: taskId },
          select: {
            assignedTo: true, // Verificar quién tiene asignada la tarea
          },
        });

        console.log("Tarea:", task); // Log de la tarea
        console.log("Usuario actual (user.userId):", user.userId); // Log del usuario actual

        // Verificar si la tarea existe
        if (!task) {
          return res.status(404).json({ error: "Tarea no encontrada" });
        }

        // Verificamos si el usuario autenticado es el asignado a la tarea
        if (task.assignedTo !== user.userId) {
          console.log("El usuario no tiene permiso para actualizar esta tarea");
          return res.status(403).json({ error: "No tienes permiso para actualizar esta tarea" });
        }

        // Actualizar solo el estado de la tarea
        const updatedTask = await prisma.task.update({
          where: { id: taskId },
          data: { status: body.status }, // Solo se actualiza el estado
        });

        return res.status(200).json({ task: updatedTask }); // Devolver la tarea actualizada
      } catch (error) {
        console.error("Error al actualizar la tarea:", error);
        // No mostrar el error en consola del cliente
        return res.status(500).json({ error: "Hubo un error al actualizar la tarea. Intenta nuevamente." });
      }

    default:
      res.setHeader("Allow", ["PUT"]);
      return res.status(405).json({ error: `Método ${method} no permitido` });
  }
}