import bcrypt from "bcryptjs";
import { prisma } from "../src/prisma.js";

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be defined");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email: email.toLowerCase() },
    update: { passwordHash, role: "ADMIN" },
    create: {
      email: email.toLowerCase(),
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log("Admin user ready", { id: admin.id, email: admin.email });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
