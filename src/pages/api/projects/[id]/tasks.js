// pages/api/projects/[id]/tasks.js
import prisma from "/lib/prisma";
import { authenticate } from "/lib/auth";

export default async function handler(req, res) {
    const user = authenticate(req, res);
    if (!user) return;

    const { id: projectId } = req.query;

    if (req.method === "POST") {
        const { title, assignedUsers } = req.body;
        try {
            const newTask = await prisma.task.create({
                data: {
                    title,
                    projectId,
                    assignedUsers: {
                        connect: assignedUsers?.map((userId) => ({ id: userId })) || [],
                    },
                },
                include: {
                    assignedUsers: {
                        select: { id: true, name: true },
                    },
                },
            });
            return res.status(201).json({ task: newTask });
        } catch (error) {
            console.error("Error al crear la tarea:", error);
            return res.status(500).json({ error: "Error al crear la tarea" });
        }
    } else {
        return res.status(405).json({ error: "Método no permitido" });
    }
}
