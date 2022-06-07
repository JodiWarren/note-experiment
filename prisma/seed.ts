import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "rachel@remix.run";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("racheliscool", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  const page = await prisma.page.create({
    data: {
      title: "Test page",
      slug: "test-page",
      userId: user.id,
      blockOrder: JSON.stringify([])
    }
  })

  const block1 = await prisma.block.create({
    data: {
      type: 'text',
      body: "Hello",
      pageId: page.id
    }
  })

  const block2 = await prisma.block.create({
    data: {
      type: 'text',
      body: "World",
      pageId: page.id
    }
  })

  await prisma.page.update({
    where: { id: page.id },
    data: { blockOrder: JSON.stringify([block1.id, block2.id]) }
  })

  await prisma.note.create({
    data: {
      title: "My first note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  await prisma.note.create({
    data: {
      title: "My second note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
