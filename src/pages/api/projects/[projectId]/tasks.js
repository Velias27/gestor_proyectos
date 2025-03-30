import prisma from "/lib/prisma";

export default async function handler(req, res) {
  const { projectId } = req.query;
  const { method } = req;

  switch (method) {
    case "POST": {
      const { title, assignedUsers, status, comments } = req.body;
      try {
        const newTask = await prisma.task.create({
          data: {
            title,
            project: { connect: { id: projectId } },
            status,
            comments,
            assignees: {
              connect: assignedUsers?.map((userId) => ({ id: userId })) || [],
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

        return res.status(200).json({ task: newTask });
      } catch (error) {
        console.error("Error al crear la tarea:", error);
        return res.status(500).json({ error: "Error al crear la tarea." });
      }
    }
    default:
      return res.status(405).json({ error: `Método ${method} no permitido` });
  }
}