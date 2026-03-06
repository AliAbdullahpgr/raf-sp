import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("SuperAdmin@123", 10);

  const user = await prisma.user.upsert({
    where: { email: "superadmin@raf-sp.gov.pk" },
    update: { role: "SUPER_ADMIN", password: hashedPassword },
    create: {
      name: "Super Admin",
      email: "superadmin@raf-sp.gov.pk",
      password: hashedPassword,
      role: "SUPER_ADMIN",
    },
  });

  console.log("Super Admin created:");
  console.log(`  Email: superadmin@raf-sp.gov.pk`);
  console.log(`  Password: SuperAdmin@123`);
  console.log(`  Role: ${user.role}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
