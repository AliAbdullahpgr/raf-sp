import "dotenv/config";
import bcrypt from "bcrypt";
import {prisma } from '../../lib/prisma';

async function seedAgriLogin(){
    const password = await bcrypt.hash("ChangeMe123!", 10);
    await prisma.user.upsert({
      where: {
        email: "daemultan@yahoo.com",
      },
      update: {},
      create: {
        name: "Agriculture Engineering Field Wing Focal person",
        email: "daemultan@yahoo.com",
        password,
        role: "DEPT_HEAD",
        departmentId: "cmj65jhlf0000d8txuj8coej0",
      },
    });
    console.log("Agri Engineering Seeded");
}

seedAgriLogin()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
