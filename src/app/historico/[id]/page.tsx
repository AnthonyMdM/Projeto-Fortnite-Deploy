import { findUser, getItemsOffer, getOffer } from "@/src/actions/actionsDB";
import PageItemOffer from "@/src/components/view/ItemPageOffer";
import { auth } from "@/src/lib/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Compras",
  description: "Todas as suas compras",
};

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
  const items = await getOffer(Number(id));
  const user = await findUser(Number(session?.user?.id));

  if (itemFind.length === 0 || user === null) {
    return <p className="text-white">Itens não encontrado.</p>;
  }

  return <PageItemOffer item={itemFind} offer={items} user={user} />;
}
