import { getUserItemIds } from "@/src/actions/actionsDB";
import { FindCosmetics, getShopItemIds } from "@/src/actions/actionsFindItens";
import PageCosmetics from "@/src/components/view/CosmeticPage";
import { auth } from "@/src/lib/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cosméticos",
  description: "Todos Cosméticos",
};

export default async function Page() {
  const session = await auth();
  const listShop = await getShopItemIds();
  const dados = await FindCosmetics();
  if (dados === null) return <p>Erro ao buscar dados</p>;

  if (!session) {
    return <PageCosmetics initialData={dados} listShop={listShop} />;
  }

  const idItemsBuy = await getUserItemIds(Number(session.user.id));

  return (
    <PageCosmetics
      initialData={dados}
      listShop={listShop}
      itensComprados={idItemsBuy}
    />
  );
}
