// /pages/api/team-members.js
import prisma from "/lib/prisma";
import { authenticate } from "/lib/auth";

export default async function handler(req, res) {
    const user = authenticate(req, res);
    if (!user) return;

    if (req.method === "GET") {
        try {
            const teamMembers = await prisma.user.findMany({
                where: { role: "TEAM_MEMBER" },
                select: { id: true, name: true },
            });
            return res.status(200).json({ teamMembers });
        } catch (error) {
            console.error("Error al obtener los usuarios:", error);
            return res.status(500).json({ error: "Error al obtener los usuarios" });
        }
    } else {
        res.setHeader("Allow", ["GET"]);
        return res.status(405).json({ error: `Método ${req.method} no permitido` });
    }
}
