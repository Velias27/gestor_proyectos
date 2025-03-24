// pages/api/projects/[id].js
import prisma from "/lib/prisma";

export default async function handler(req, res) {
  const user = authenticate(req, res);
  if (!user) return;

  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const project = await prisma.project.findUnique({
        where: { id },
        include: { tasks: true },
      });
      if (!project)
        return res.status(404).json({ error: "Proyecto no encontrado" });
      return res.status(200).json({ project });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error al obtener proyecto" });
    }
  } else if (req.method === "PUT") {
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
  } else if (req.method === "DELETE") {
    try {
      const deletedProject = await prisma.project.delete({ where: { id } });
      return res.status(200).json({ project: deletedProject });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error al eliminar proyecto" });
    }
  } else {
    return res.status(405).json({ error: "Método no permitido" });
  }
}
