import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...");

  // Limpa tabelas antes de popular
  await prisma.purchase.deleteMany();
  await prisma.user.deleteMany();

  // Cria 21 usuários
  for (let i = 1; i <= 21; i++) {
    const user = await prisma.user.create({
      data: {
        name: `User ${i}`,
        image: `https://api.dicebear.com/9.x/identicon/svg?seed=${i}`,
        email: `user${i}@example.com`,
        passwordHash: `hashed_password_${i}`,
        vbucks: 10000 + i * 100,
        purchases: {
          create: [
            {
              itemId: `item_${i}_1`,
              price: 1200,
            },
            {
              itemId: `item_${i}_2`,
              price: 800,
            },
          ],
        },
      },
      include: { purchases: true },
    });

    console.log(`✅ Usuário ${user.email} criado com ${user.purchases.length} compras.`);
  }

  console.log("🎉 Seed finalizado com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro ao executar seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
