import {
  FindCosmeticItemById,
  getShopItemIds,
} from "@/src/actions/actionsFindItens";
import PageItemCosmetics from "@/src/components/view/ItemCosmeticPage";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Item Fortnite",
  description: "Item",
};

export default async function Page({
  params,
}: {
  params: Promise<{ item: string }>;
}) {
  const { item } = await params;
  const itemFind = await FindCosmeticItemById(item);
  const listShop = await getShopItemIds();
  if (!itemFind) {
    notFound();
  }
  if (listShop.includes(item)) {
    return <PageItemCosmetics item={itemFind} itemShop={true} />;
  }

  return <PageItemCosmetics item={itemFind} itemShop={false} />;
}
