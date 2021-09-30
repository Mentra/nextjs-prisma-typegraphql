import { encryptPassword } from "../lib/session";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  console.log("Seeding database...");
  await prisma.user.create({
    data: {
      email: "test@yeah.com",
      name: "Test User",
      password: await encryptPassword("Pr1sm4!")
    }
  });
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  .finally(async () => {
    console.log("Seed complete!");
    await prisma.$disconnect();
  });
