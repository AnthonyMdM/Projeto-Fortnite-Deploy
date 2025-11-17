import { findUser, getUserItemIds } from "@/src/actions/actionsDB";
import { FindShopItem } from "@/src/actions/actionsFindItens";
import PageItem from "@/src/components/view/ItemPage";
import { auth } from "@/src/lib/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Oferta Shop",
  description: "Oferta",
};

export default async function Page({
  params,
}: {
  params: Promise<{ item: string }>;
}) {
  const session = await auth();
  console.log("Sessão atual:", session);
  const { item } = await params;
  const itemFind = await FindShopItem(item);
  if (!itemFind) {
    return <p className="text-white">Item não encontrado.</p>;
  }

  const user = await findUser(Number(session?.user.id));

  if (!session || user === null || user === undefined) {
    return <PageItem item={itemFind} />;
  }

  const idBuy = await getUserItemIds(Number(session.user.id));

  return <PageItem item={itemFind} listIds={idBuy} user={user} />;
}
