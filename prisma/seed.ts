import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const basePassword = "Fortnite!23";

async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

async function main() {
  console.log("🌱 Iniciando seed...");

  await prisma.offerBuy_ItemsBuy.deleteMany();
  await prisma.offerBuy.deleteMany();
  await prisma.itemsBuy.deleteMany();
  await prisma.user.deleteMany();

  const users = [
    {
      name: "V-Bucks Fan",
      email: "player1@fortnite.io",
      image: "https://api.dicebear.com/9.x/identicon/svg?seed=vbucks",
    },
    {
      name: "Battle Pass",
      email: "player2@fortnite.io",
      image: "https://api.dicebear.com/9.x/identicon/svg?seed=battlepass",
    },
  ];

  const passwordHash = await hashPassword(basePassword);

  for (const userInfo of users) {
    const user = await prisma.user.create({
      data: {
        ...userInfo,
        passwordHash,
      },
    });

    const itemLines = [
      {
        itemId: `"skin-"${user.id}"-dragon"`,
        image: "https://placehold.co/256x256/dragon",
      },
      {
        itemId: `backpack-${user.id}-glow`,
        image: "https://placehold.co/256x256/glow",
      },
      {
        itemId: `emote-${user.id}-strike`,
        image: "https://placehold.co/256x256/emote",
      },
    ];

    const createdItems = await Promise.all(
      itemLines.map((item) =>
        prisma.itemsBuy.create({
          data: { userId: user.id, ...item },
        })
      )
    );

    const offer = await prisma.offerBuy.create({
      data: {
        userId: user.id,
        offerId: `bundle-${user.id}`,
        price: 1800,
      },
    });

    await prisma.offerBuy_ItemsBuy.createMany({
      data: createdItems.map((item) => ({
        offerBuyId: offer.id,
        itemBuyId: item.id,
      })),
    });

    console.log(
      `✅ Seeded ${user.email} with ${createdItems.length} itens e a oferta ${offer.offerId}. Use senha" ${basePassword} para acessar.`
    );
  }

  console.log("🎉 Seed finalizado com sucesso!");
}

main()
  .catch((error) => {
    console.error("❌ Erro ao executar seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
