// app/profile/wardrobe/page.tsx
import { getUserOfferIds } from "@/src/actions/actionsDB";
import { PageHistorico } from "@/src/components/view/HistoricoPage";

import { auth } from "@/src/lib/auth";
import { redirect } from "next/navigation";

export default async function WardrobePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const userId = Number(session.user.id);
  const items = await getUserOfferIds(userId);

  if (items.length === 0) {
    return <p>Nenhum item encontrado</p>;
  }

  return <PageHistorico offers={items} />;
}
