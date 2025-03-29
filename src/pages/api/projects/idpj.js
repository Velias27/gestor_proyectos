// /pages/api/projects/index.js

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
          include: {
            tasks: {
              select: {
                id: true,
                title: true,
                status: true,
                assignee: {
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
        console.error(error);
        return res.status(500).json({ error: "Error al obtener proyectos" });
      }

    default:
      res.setHeader("Allow", ["GET"]);
      return res.status(405).json({ error: `Método ${method} no permitido` });
  }
}