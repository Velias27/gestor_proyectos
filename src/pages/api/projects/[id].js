import prisma from "/lib/prisma";
import { authenticate } from "/lib/auth";

export default async function handler(req, res) {
  const user = authenticate(req, res);
  if (!user) return;

  const { id } = req.query;
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const project = await prisma.project.findUnique({
          where: { id },
          include: {
            tasks: {
              select: {
                id: true,
                title: true,
                completed: true,
                assignedTo: true,
                assignee: {
                  select: { name: true },
                },
                status: true,
                comments: true,
              },
            },
          },
        });

        if (!project) {
          return res.status(404).json({ error: "Proyecto no encontrado" });
        }
        return res.status(200).json({ project });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al obtener proyecto" });
      }
    case "PUT":
      try {
        const { name } = req.body;
        const updatedProject = await prisma.project.update({
          where: { id },
          data: { name },
        });
        return res.status(200).json({ project: updatedProject });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al actualizar proyecto" });
      }
    case "DELETE":
      try {
        const deletedProject = await prisma.project.delete({
          where: { id },
        });
        return res.status(200).json({ project: deletedProject });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al eliminar proyecto" });
      }
    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      return res.status(405).json({ error: `Método ${method} no permitido` });
  }
}
