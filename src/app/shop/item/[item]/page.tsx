import { getUserItemIds } from "@/src/actions/actionsDB";
import { FindShopItem } from "@/src/actions/actionsFindItens";
import PageItem from "@/src/components/view/ItemPage";
import { auth } from "@/src/lib/auth";

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

  // Usuário não logado → retorna item sem lista
  if (!session) {
    return <PageItem item={itemFind} />;
  }

  // Usuário logado → busca ids dos itens comprados
  const idBuy = await getUserItemIds(Number(session.user.id));

  return <PageItem item={itemFind} listIds={idBuy} />;
}
