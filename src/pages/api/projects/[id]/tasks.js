import prisma from "/lib/prisma";

export default async function handler(req, res) {
  const { id } = req.query;
  const { method } = req;

  switch (method) {
    case "POST":
      const { title, assignedUsers, status, comments } = req.body; // Asegúrate de recibir assignedUsers correctamente
      try {
        const newTask = await prisma.task.create({
          data: {
            title,
            projectId: id,  // Usar el ID del proyecto
            assignedTo: assignedUsers ? assignedUsers[0] : null, // Asignar el primer usuario de la lista de assignedUsers
            status,   // Usar el campo de status
            comments, // Usar el campo de comentarios
          },
          include: {
            assignee: {  // Incluir el usuario asignado
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
    default:
      return res.status(405).json({ error: `Método ${method} no permitido` });
  }
}