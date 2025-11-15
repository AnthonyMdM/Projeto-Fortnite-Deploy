import { findUser, getItemsOffer, getOffer } from "@/src/actions/actionsDB";
import { FindCosmeticItemById } from "@/src/actions/actionsFindItens";
import PageItemOffer from "@/src/components/view/ItemPageOffer";
import { auth } from "@/src/lib/auth";
import { FortniteSingleItem } from "@/src/types/cosmeticsType";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  console.log("Sessão atual:", session);
  const { id } = await params;
  const itemFind = await getItemsOffer(Number(id));
  const enrichedItems = (
    await Promise.all(
      itemFind.map(async (item) => {
        return await FindCosmeticItemById(item);
      })
    )
  ).filter(Boolean) as FortniteSingleItem[];
  const items = await getOffer(Number(id));
  const user = await findUser(Number(session.user.id));

  if (itemFind.length === 0 || !items) {
    return <p className="text-white">Itens não encontrado.</p>;
  }

  return <PageItemOffer item={enrichedItems} offer={items} user={user} />;
}
