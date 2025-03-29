// /pages/api/tasks/userApiTask.js

import prisma from "/lib/prisma";
import { authenticate } from "/lib/auth";

export default async function handler(req, res) {
  const user = authenticate(req, res);
  if (!user) return;

  const { id } = req.query; // ID del proyecto
  const { assignedTo } = req.query; // ID del usuario para filtrar tareas
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        // Verificar que tanto el id del proyecto como el assignedTo estén presentes
        if (!assignedTo) {
          return res.status(400).json({ error: "Se debe proporcionar el ID del usuario (assignedTo)" });
        }
        console.log(assignedTo)
        // Buscar el proyecto con las tareas asignadas al usuario
        const project = await prisma.project.findUnique({
          where: { id },
          include: {
            tasks: {
              where: { assignedTo: assignedTo }, // Filtrar tareas asignadas al usuario
              select: {
                id: true,
                title: true,
                status: true,
                comments: true,
                assignedTo: true,
                assignee: {
                  select: { name: true },
                },
              },
            },
          },
        });

        // Verificar si el proyecto existe
        if (!project) {
          return res.status(404).json({ error: "Proyecto no encontrado" });
        }

        // Verificar si hay tareas asignadas al usuario
        if (project.tasks.length === 0) {
          return res.status(404).json({ error: "No hay tareas asignadas a este usuario en este proyecto" });
        }

        // Si todo está bien, devolver el proyecto con las tareas asignadas
        return res.status(200).json({ project });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al obtener el proyecto" });
      }

    default:
      res.setHeader("Allow", ["GET"]);
      return res.status(405).json({ error: `Método ${method} no permitido` });
  }
}