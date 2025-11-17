"use server";

import {
  FortniteApiNewResponse,
  FortniteBean,
  FortniteBr,
  FortniteCar,
  FortniteInstrument,
  FortniteItems,
  FortniteLego,
  FortniteLegoKit,
  FortniteSingleItem,
  FortniteTrack,
  ShopEntryItem,
  ShopResponse,
} from "@/src/types/APIType";

function normalizeToSingleItem(
  item: any,
  category: string
): FortniteSingleItem {
  switch (category) {
    case "br":
      const brItem = item as FortniteBr;
      return {
        id: brItem.id,
        name: brItem.name,
        description: brItem.description,
        type: brItem.type,
        rarity: brItem.rarity,
        series: brItem.series || undefined,
        set: brItem.set || undefined,
        images: brItem.images,
        introduction: brItem.introduction || undefined,
        added: brItem.added,
      };
    case "tracks":
      const track = item as FortniteTrack;
      return {
        id: track.id,
        name: track.title,
        description: `${track.artist} • ${track.releaseYear} • ${Math.floor(
          track.duration / 60
        )}:${(track.duration % 60).toString().padStart(2, "0")}`,
        type: { value: "Track", displayValue: "Track", backendValue: "track" },
        images: {
          icon: track.albumArt || "/placeholder.png",
          smallIcon: track.albumArt || "/placeholder.png",
        },
        added: track.added,
      };
    case "instruments":
      const instrument = item as FortniteInstrument;
      return {
        id: instrument.id,
        name: instrument.name,
        description: instrument.description,
        type: instrument.type,
        rarity: instrument.rarity,
        images: {
          icon: instrument.images?.large || "/placeholder.png",
          smallIcon: instrument.images?.small || "/placeholder.png",
        },
        added: instrument.added,
      };
    case "cars":
      const car = item as FortniteCar;
      return {
        id: car.id,
        name: car.name,
        description: car.description,
        type: car.type,
        rarity: car.rarity,
        images: {
          icon: car.images?.large || "/placeholder.png",
          smallIcon: car.images?.small || "/placeholder.png",
        },
        added: car.added,
      };
    case "lego":
      const lego = item as FortniteLego;
      return {
        id: lego.id,
        name: lego.cosmeticId || lego.id,
        type: { value: "LEGO", displayValue: "LEGO", backendValue: "lego" },
        images: {
          icon: lego.images?.large || "/placeholder.png",
          smallIcon: lego.images?.small || "/placeholder.png",
        },
        added: lego.added,
      };
    case "legoKits":
      const legoKit = item as FortniteLegoKit;
      return {
        id: legoKit.id,
        name: legoKit.name,
        type: legoKit.type,
        series: legoKit.series,
        images: {
          icon:
            legoKit.images?.wide || legoKit.images?.small || "/placeholder.png",
          smallIcon: legoKit.images?.small || "/placeholder.png",
        },
        added: legoKit.added,
      };
    case "beans":
      const bean = item as FortniteBean;
      return {
        id: bean.id,
        name: bean.name,
        description: `Gênero: ${bean.gender}`,
        type: { value: "Bean", displayValue: "Bean", backendValue: "bean" },
        images: {
          icon: bean.images?.large || "/placeholder.png",
          smallIcon: bean.images?.small || "/placeholder.png",
        },
        added: bean.added,
      };
    default:
      return item as FortniteSingleItem;
  }
}

export async function fetchFromAPI(): Promise<FortniteSingleItem[]> {
  const response = await fetch(
    "https://fortnite-api.com/v2/cosmetics?language=pt-BR",
    { cache: "no-store" }
  );
  if (!response.ok)
    throw new Error(`Erro na API: ${response.status} ${response.statusText}`);

  const json = (await response.json()) as {
    status: number;
    data: FortniteItems;
  };
  if (!json?.data) throw new Error("Dados inválidos retornados pela API");

  const normalizedItems: FortniteSingleItem[] = [];

  const categories: Array<keyof FortniteItems> = [
    "br",
    "tracks",
    "instruments",
    "cars",
    "lego",
    "legoKits",
    "beans",
  ];
  for (const category of categories) {
    const categoryItems = json.data[category];
    if (Array.isArray(categoryItems))
      categoryItems.forEach((item) =>
        normalizedItems.push(normalizeToSingleItem(item, category))
      );
  }

  console.log(`✅ ${normalizedItems.length} itens normalizados da API`);
  return normalizedItems;
}

export async function FindCosmetics(): Promise<FortniteSingleItem[] | null> {
  try {
    return await fetchFromAPI();
  } catch (error: any) {
    console.error("❌ Erro ao buscar cosméticos:", error.message);
    return null;
  }
}

export async function FindCosmeticItemById(
  id: string
): Promise<FortniteSingleItem | null> {
  try {
    const allItems = await fetchFromAPI();
    const foundItem = allItems.find((item) => item.id === id);
    if (!foundItem) console.warn(`⚠️ Item com ID "${id}" não encontrado`);
    return foundItem || null;
  } catch (error: any) {
    console.error(`❌ Erro ao buscar cosmético com ID "${id}":`, error.message);
    return null;
  }
}

export async function FindCosmeticsNew(): Promise<FortniteItems | null> {
  try {
    const response = await fetch(
      "https://fortnite-api.com/v2/cosmetics/new?language=pt-BR",
      { cache: "no-store" }
    );
    const json = (await response.json()) as FortniteApiNewResponse;
    if (!json || json.status === 400)
      throw new Error("Dados do shop não encontrados");
    return json.data.items;
  } catch (error: any) {
    console.error("❌ Erro ao buscar cosméticos:", error.message);
    return null;
  }
}

async function fetchShopData(): Promise<ShopResponse> {
  const response = await fetch(
    "https://fortnite-api.com/v2/shop?language=pt-BR",
    { cache: "no-store" }
  );
  const json = (await response.json()) as ShopResponse;
  if (!json || json.status === 400)
    throw new Error("Dados do shop não encontrados");
  return json;
}

export async function FindCosmeticsShop(): Promise<{
  groupedBundles: any[];
  groupedItems: any[];
}> {
  try {
    const json = await fetchShopData();
    const lista = json.data.entries;

    const bundles = lista.filter(
      (entry) => entry.bundle !== undefined && entry.offerId
    );
    const items = lista.filter((entry) => !entry.bundle && entry.offerId);

    const groupByLayout = (entries: ShopEntryItem[]) => {
      const groups = new Map<
        string,
        { layoutId: string; layoutName: string; entries: ShopEntryItem[] }
      >();
      for (const entry of entries) {
        const id = entry.layout?.id ?? "sem-layout";
        const name = entry.layout?.name ?? "Outros";
        if (!groups.has(id))
          groups.set(id, { layoutId: id, layoutName: name, entries: [] });
        groups.get(id)!.entries.push(entry);
      }
      return Array.from(groups.values());
    };

    return {
      groupedBundles: groupByLayout(bundles),
      groupedItems: groupByLayout(items),
    };
  } catch (error: any) {
    console.error("❌ Erro ao buscar cosméticos:", error.message);
    return { groupedBundles: [], groupedItems: [] };
  }
}

export async function FindShopItem(
  item: string
): Promise<ShopEntryItem | null> {
  try {
    const decodedOfferId = decodeURIComponent(item);
    const json = await fetchShopData();
    const items = json.data.entries;
    return items.find((i) => i.offerId === decodedOfferId) || null;
  } catch (error: any) {
    console.error("❌ Erro ao buscar cosmético:", error.message);
    return null;
  }
}

export async function getShopItemIds(): Promise<string[]> {
  try {
    const shopData = await fetchShopData();
    const itemIds: string[] = [];
    shopData.data.entries.forEach((entry) => {
      entry.brItems?.forEach((i) => itemIds.push(i.id));
      entry.tracks?.forEach((i) => itemIds.push(i.id));
      entry.cars?.forEach((i) => itemIds.push(i.id));
      entry.instruments?.forEach((i) => itemIds.push(i.id));
      entry.legoKits?.forEach((i) => itemIds.push(i.id));
    });
    console.log(`✅ ${itemIds.length} itens encontrados na loja`);
    return itemIds;
  } catch (error: any) {
    console.warn("⚠️ Não foi possível buscar itens da loja");
    return [];
  }
}
