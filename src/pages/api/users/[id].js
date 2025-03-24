// pages/api/users/[id].js
import prisma from "../../../lib/prisma";
import { authenticate } from "../../../lib/auth";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  const authUser = authenticate(req, res);
  if (!authUser) return;

  // Solo ADMIN puede editar o eliminar usuarios
  if (authUser.role !== "ADMIN") {
    return res.status(403).json({ error: "No autorizado" });
  }

  const { id } = req.query;

  if (req.method === "PUT") {
    const { name, email, password, role } = req.body;
    let updateData = { name, email, role };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    try {
      const updatedUser = await prisma.user.update({
        where: { id },
        data: updateData,
      });
      return res.status(200).json({ user: updatedUser });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error al actualizar usuario" });
    }
  } else if (req.method === "DELETE") {
    try {
      const deletedUser = await prisma.user.delete({ where: { id } });
      return res.status(200).json({ user: deletedUser });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error al eliminar usuario" });
    }
  } else {
    return res.status(405).json({ error: "Método no permitido" });
  }
}
