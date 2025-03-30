import prisma from "/lib/prisma";
import { authenticate } from "/lib/auth";

export default async function handler(req, res) {
  const user = authenticate(req, res);
  if (!user) return;

  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const projects = await prisma.project.findMany({
          where: {
            tasks: {
              some: {
                assignees: {
                  some: {
                    id: user.id,
                  },
                },
              },
            },
          },
          include: {
            tasks: {
              where: {
                assignees: {
                  some: {
                    id: user.id,
                  },
                },
              },
              select: {
                id: true,
                title: true,
                completed: true,
                status: true,
                comments: true,
                assignees: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        });

        return res.status(200).json({ projects });
      } catch (error) {
        console.error("Error al obtener proyectos asignados:", error);
        return res.status(500).json({ error: "Error al obtener proyectos asignados" });
      }

    default:
      res.setHeader("Allow", ["GET"]);
      return res.status(405).json({ error: `Método ${method} no permitido` });
  }
}
