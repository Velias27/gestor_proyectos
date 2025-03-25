// pages/api/team-members.js
import prisma from "/lib/prisma";
import { authenticate } from "/lib/auth";

export default async function handler(req, res) {
    const user = authenticate(req, res);
    if (!user) return;
    try {
        const teamMembers = await prisma.user.findMany({
            where: { role: "TEAM_MEMBER" },
            select: { id: true, name: true },
        });
        return res.status(200).json({ teamMembers });
    } catch (err) {
        console.error("Error al obtener los usuarios:", err);
        return res.status(500).json({ error: "Error al obtener usuarios" });
    }
}
