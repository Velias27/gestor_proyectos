// prisma/seed.js
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Hash de las contraseñas para cada usuario
  const passwordAdmin = await bcrypt.hash("adminPassword", 10);
  const passwordPM = await bcrypt.hash("pmPassword", 10);
  const passwordTeam = await bcrypt.hash("teamPassword", 10);
  const passwordTeam2 = await bcrypt.hash("teamPassword", 10);

  // Crear usuario ADMIN
  const adminUser = await prisma.user.create({
    data: {
      name: "ADMIN",
      email: "admin@example.com",
      password: passwordAdmin,
      role: "ADMIN",
    },
  });

  // Crear usuario PROJECT_MANAGER
  const pmUser = await prisma.user.create({
    data: {
      name: "PROJECT_MANAGER",
      email: "pm@example.com",
      password: passwordPM,
      role: "PROJECT_MANAGER",
    },
  });

  // Crear usuario TEAM_MEMBER
  const teamUser = await prisma.user.create({
    data: {
      name: "TEAM_MEMBER",
      email: "team@example.com",
      password: passwordTeam,
      role: "TEAM_MEMBER",
    },
  });

  const teamUser2 = await prisma.user.create({
    data: {
      name: "user2",
      email: "team2@example.com",
      password: passwordTeam2,
      role: "TEAM_MEMBER",
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
