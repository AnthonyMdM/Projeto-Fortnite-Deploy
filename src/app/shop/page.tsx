import {
  getUserPurchasedOffers,
  getUserItemIds,
} from "@/src/actions/actionsDB";
import { FindCosmeticsShop } from "@/src/actions/actionsFindItens";
import PageShop from "@/src/components/view/ShopPage";
import { auth } from "@/src/lib/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fortnite Shop",
  description: "Loja interativa",
};
export default async function Page() {
  const { groupedBundles, groupedItems } = await FindCosmeticsShop();
  const session = await auth();
  if (!session) {
    return (
      <PageShop groupedBundles={groupedBundles} groupedItems={groupedItems} />
    );
  }
  const idItemsBuy = await getUserItemIds(Number(session.user.id));
  const purchasedOffers = await getUserPurchasedOffers(Number(session.user.id));
  const idOffersBuy = purchasedOffers.map((offer) => offer.offerId);
  return (
    <PageShop
      groupedBundles={groupedBundles}
      groupedItems={groupedItems}
      listItemsIds={idItemsBuy}
      listOffersIds={idOffersBuy}
    />
  );
}
