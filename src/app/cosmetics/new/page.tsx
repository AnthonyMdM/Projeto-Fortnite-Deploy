import { getUserItemIds } from "@/src/actions/actionsDB";
import {
  FindCosmeticsNew,
  getShopItemIds,
} from "@/src/actions/actionsFindItens";
import PageCosmeticsNew from "@/src/components/view/CosmeticNewPage";
import { auth } from "@/src/lib/auth";

export default async function Page() {
  const session = await auth();
  const dados = await FindCosmeticsNew();
  const listShop = await getShopItemIds();
  if (dados === null) return <p>Erro ao buscar dados</p>;

  if (!session) {
    return <PageCosmeticsNew initialData={dados} listShop={listShop} />;
  }

  const idItemsBuy = await getUserItemIds(Number(session.user.id));

  return (
    <PageCosmeticsNew
      initialData={dados}
      listShop={listShop}
      itensComprados={idItemsBuy}
    />
  );
}
