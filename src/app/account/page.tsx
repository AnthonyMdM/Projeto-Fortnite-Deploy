import { PageAccount } from "@/src/components/view/VestiarioPage";
import { getUserWardrobe } from "@/src/actions/actionsDB";
import { auth } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Minha Conta",
  description: "Meus Itens",
};

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const userId = Number(session.user.id);
  const items = await getUserWardrobe(userId);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-72 space-y-6 text-center">
        <div className="text-7xl drop-shadow-[0_0_20px_rgba(168,85,247,0.7)]">
          🎒
        </div>
        <p className="text-2xl font-bold text-purple-300 drop-shadow">
          Seu Vestiário está vazio!
        </p>

        <p className="text-slate-400 text-md max-w-sm">
          Você ainda não adquiriu nenhum item. Explore a loja e encontre algo
          épico!
        </p>

        <Link
          href="/shop"
          className="px-6 py-3 rounded-xl bg-linear-to-r from-purple-500 to-purple-600 
               text-white font-bold shadow-lg border border-purple-400/40
               hover:scale-105 hover:shadow-purple-500/30 transition-all"
        >
          Ir para a Loja
        </Link>
      </div>
    );
  }

  return <PageAccount items={items} />;
}
