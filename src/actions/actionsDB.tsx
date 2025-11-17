"use server";

import { revalidatePath } from "next/cache";
import { ShopEntryItem } from "@/src/types/APIType";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { ItemsBuy, OfferBuy } from "@prisma/client";

export async function findUser(id: number) {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  return user;
}

export async function getAllUsers(page: number = 1, pageSize: number = 20) {
  const skip = (page - 1) * pageSize;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: pageSize,
      skip: skip,
    }),
    prisma.user.count(),
  ]);

  return {
    users,
    total,
    totalPages: Math.ceil(total / pageSize),
    currentPage: page,
  };
}

export async function searchUsers(
  query: string,
  page: number = 1,
  pageSize: number = 20
) {
  const skip = (page - 1) * pageSize;

  const where = {
    OR: [
      { name: { contains: query, mode: "insensitive" as const } },
      { email: { contains: query, mode: "insensitive" as const } },
    ],
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        image: true,
        email: true,
        vbucks: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: pageSize,
      skip: skip,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    total,
    totalPages: Math.ceil(total / pageSize),
    currentPage: page,
  };
}

export async function getUserWardrobe(userId: number) {
  const items = await prisma.itemsBuy.findMany({
    where: { userId },
    orderBy: { purchasedAt: "desc" },
  });

  return items;
}

export async function getUserPurchaseHistory(userId: number) {
  const ofertas = await prisma.offerBuy.findMany({
    where: { userId },
    orderBy: { purchasedAt: "desc" },
  });

  return {
    ofertas,
  };
}

export async function getUserPurchasedOffers(userId: number) {
  return await prisma.offerBuy.findMany({
    where: { userId },
    include: {
      OfferBuy_ItemsBuy: {
        include: {
          ItemsBuy: true,
        },
      },
    },
    orderBy: { purchasedAt: "desc" },
  });
}

export async function getUserOfferIds(userId: number): Promise<OfferBuy[]> {
  if (!userId) {
    throw new Error("O parâmetro userId é obrigatório.");
  }

  const offers = await prisma.offerBuy.findMany({
    where: { userId },
  });

  return offers;
}

export async function getUserItemIds(userId: number): Promise<string[]> {
  if (!userId) {
    throw new Error("O parâmetro userId é obrigatório.");
  }

  const items = await prisma.itemsBuy.findMany({
    where: { userId },
    select: { itemId: true },
  });

  return items.map((i) => i.itemId);
}

export async function getOffer(offerBuyId: number): Promise<OfferBuy> {
  if (!offerBuyId) {
    throw new Error("O parâmetro offerBuyId é obrigatório.");
  }

  const relations = await prisma.offerBuy.findUnique({
    where: { id: offerBuyId },
  });

  if (!relations) {
    throw new Error("Oferta não encontrada.");
  }

  return relations;
}

export async function getItemsOffer(offerBuyId: number): Promise<ItemsBuy[]> {
  if (!offerBuyId) {
    throw new Error("O parâmetro offerBuyId é obrigatório.");
  }

  const relations = await prisma.offerBuy_ItemsBuy.findMany({
    where: { offerBuyId },
    include: {
      ItemsBuy: true,
    },
  });

  return relations.map((relation) => relation.ItemsBuy);
}

export async function createOfferBuy(shopItem: ShopEntryItem) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Usuário não autenticado" };
    }

    const userId = Number(session.user.id);
    const price = shopItem.finalPrice ?? shopItem.regularPrice;

    if (!price || price <= 0) {
      return { success: false, error: "Preço inválido" };
    }

    if (!shopItem.offerId) {
      return { success: false, error: "ID da oferta não encontrado" };
    }

    const existingOffer = await prisma.offerBuy.findUnique({
      where: {
        userId_offerId: {
          userId,
          offerId: shopItem.offerId,
        },
      },
    });

    if (existingOffer) {
      return { success: false, error: "Você já comprou esta oferta" };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { vbucks: true },
    });

    if (!user) {
      return { success: false, error: "Usuário não encontrado" };
    }

    if (user.vbucks < price) {
      return {
        success: false,
        error: `Saldo insuficiente. Você tem ${user.vbucks} V-Bucks e precisa de ${price} V-Bucks`,
      };
    }

    const getItemImage = (item: any): string => {
      // brItems - usa icon ou smallIcon
      if (item.images?.featured) return item.images.featured;
      if (item.albumArt) return item.albumArt;
      if (item.images?.large) return item.images.large;

      return "";
    };

    const allItems = [
      ...(shopItem.brItems ?? []),
      ...(shopItem.tracks ?? []),
      ...(shopItem.cars ?? []),
      ...(shopItem.instruments ?? []),
      ...(shopItem.legoKits ?? []),
    ];

    if (allItems.length === 0) {
      return { success: false, error: "Esta oferta não contém itens válidos" };
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Decrementar V-Bucks
      await tx.user.update({
        where: { id: userId },
        data: { vbucks: { decrement: price } },
      });

      const offerImage =
        shopItem.newDisplayAsset?.renderImages?.[0]?.image ||
        shopItem.items?.[0]?.images?.icon ||
        shopItem.items?.[0]?.images?.smallIcon ||
        "";

      const offerTag = shopItem.offerTag?.text || null;

      const offerBuy = await tx.offerBuy.create({
        data: {
          userId,
          offerId: shopItem.offerId,
          price,
          image: offerImage,
          offerTag: offerTag,
        },
      });

      const itemBuyIds: number[] = [];

      const getItemName = (item: any): string => {
        // Tracks usam "title" ao invés de "name"
        if ("title" in item && item.title) return item.title;

        if ("name" in item && item.name) return item.name;

        if ("cosmeticId" in item && item.cosmeticId) return item.cosmeticId;
        if ("devName" in item && item.devName) return item.devName;

        return "Item sem nome";
      };

      for (const item of allItems) {
        const itemImage = getItemImage(item);
        const itemName = getItemName(item);

        const itemBuy = await tx.itemsBuy.upsert({
          where: {
            userId_itemId: {
              userId,
              itemId: item.id,
            },
          },
          create: {
            userId,
            itemId: item.id,
            name: itemName,
            image: itemImage,
          },
          update: {
            name: itemName,
            image: itemImage,
          },
        });

        itemBuyIds.push(itemBuy.id);
      }

      await tx.offerBuy_ItemsBuy.createMany({
        data: itemBuyIds.map((itemBuyId) => ({
          offerBuyId: offerBuy.id,
          itemBuyId,
        })),
        skipDuplicates: true,
      });

      return { offerBuy, itemsCount: itemBuyIds.length };
    });

    revalidatePath("/shop");
    revalidatePath("/profile");

    return {
      success: true,
      offerBuy: result.offerBuy,
      message: `Compra realizada com sucesso! ${result.itemsCount} itens adquiridos.`,
    };
  } catch (error: any) {
    console.error("Erro ao criar compra:", error);
    return {
      success: false,
      error: error.message ?? "Erro ao processar compra",
    };
  }
}

export async function refundOffer(offerBuyId: number) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Usuário não autenticado" };
    }

    const userId = Number(session.user.id);

    const offer = await prisma.offerBuy.findUnique({
      where: {
        id: offerBuyId,
        userId,
      },
      include: {
        OfferBuy_ItemsBuy: {
          include: {
            ItemsBuy: true,
          },
        },
      },
    });

    if (!offer) {
      return { success: false, error: "Oferta não encontrada" };
    }

    if (offer.userId !== userId) {
      return { success: false, error: "Esta oferta não pertence a você" };
    }

    const itemIds = offer.OfferBuy_ItemsBuy.map((oi) => oi.ItemsBuy.id);
    const refundAmount = offer.price;

    const result = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: {
          vbucks: { increment: refundAmount },
          updatedAt: new Date(),
        },
      });
      await tx.offerBuy_ItemsBuy.deleteMany({
        where: { offerBuyId: offer.id },
      });

      await tx.offerBuy.delete({
        where: { id: offerBuyId },
      });

      const itemsToDelete: number[] = [];

      for (const itemId of itemIds) {
        const stillInUse = await tx.offerBuy_ItemsBuy.findFirst({
          where: {
            itemBuyId: itemId,
            OfferBuy: {
              userId: userId,
            },
          },
        });

        if (!stillInUse) {
          itemsToDelete.push(itemId);
        }
      }

      // Deletar itens órfãos
      if (itemsToDelete.length > 0) {
        await tx.itemsBuy.deleteMany({
          where: { id: { in: itemsToDelete } },
        });
      }

      return {
        refundedAmount: refundAmount,
        deletedItems: itemsToDelete.length,
      };
    });

    revalidatePath("/shop");
    revalidatePath("/profile");

    return {
      success: true,
      refundedAmount: result.refundedAmount,
      deletedItems: result.deletedItems,
      message: `Reembolso de ${result.refundedAmount} V-Bucks realizado com sucesso! ${result.deletedItems} itens removidos.`,
    };
  } catch (error: any) {
    console.error("Erro ao reembolsar oferta:", error);
    return {
      success: false,
      error: error.message ?? "Erro ao processar reembolso",
    };
  }
}

export async function refundOffersWithItem(itemId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Usuário não autenticado" };
    }

    const userId = Number(session.user.id);

    const itemBuy = await prisma.itemsBuy.findUnique({
      where: {
        userId_itemId: {
          userId,
          itemId,
        },
      },
      include: {
        OfferBuy_ItemsBuy: {
          include: {
            OfferBuy: true,
          },
        },
      },
    });

    if (!itemBuy) {
      return { success: false, error: "Item não encontrado nas suas compras" };
    }

    const offerIds = itemBuy.OfferBuy_ItemsBuy.map((o) => o.OfferBuy.id);

    if (offerIds.length === 0) {
      return {
        success: false,
        error: "Nenhuma oferta encontrada com este item",
      };
    }

    let totalRefunded = 0;
    const deletedOffers: number[] = [];

    // Reembolsar cada oferta
    for (const offerId of offerIds) {
      const result = await refundOffer(offerId);
      if (result.success) {
        totalRefunded += result.refundedAmount || 0;
        deletedOffers.push(offerId);
      }
    }

    return {
      success: true,
      totalRefunded,
      offersRefunded: deletedOffers.length,
      message: `${deletedOffers.length} ofertas reembolsadas. Total: ${totalRefunded} V-Bucks devolvidos.`,
    };
  } catch (error: any) {
    console.error("Erro ao reembolsar ofertas com item:", error);
    return {
      success: false,
      error: error.message ?? "Erro ao processar reembolso",
    };
  }
}

export async function getUserStats(userId: number) {
  const [totalSpent, totalOffers, totalItems] = await Promise.all([
    prisma.offerBuy.aggregate({
      where: { userId },
      _sum: { price: true },
    }),
    prisma.offerBuy.count({ where: { userId } }),
    prisma.itemsBuy.count({ where: { userId } }),
  ]);

  return {
    totalSpent: totalSpent._sum.price ?? 0,
    totalOffers,
    totalItems,
  };
}
