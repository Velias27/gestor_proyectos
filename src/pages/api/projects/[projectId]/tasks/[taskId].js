import prisma from "/lib/prisma";

export default async function handler(req, res) {
  const { taskId } = req.query;

  if (req.method === "PUT") {
    const { title, status, comments, assignedUsers } = req.body;
    try {
      const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: {
          title,
          status,
          comments,
          assignees: {
            set: assignedUsers.map((id) => ({ id })),
          },
        },
        include: {
          assignees: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return res.status(200).json({ task: updatedTask });
    } catch (error) {
      console.error("Error al actualizar tarea:", error);
      return res.status(500).json({ error: "Error al actualizar tarea" });
    }
  }

  if (req.method === "DELETE") {
    try {
      await prisma.task.delete({
        where: { id: taskId },
      });
      return res.status(200).json({ message: "Tarea eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
      return res.status(500).json({ error: "Error al eliminar tarea" });
    }
  }

  return res.status(405).json({ error: `Método ${req.method} no permitido` });
}
