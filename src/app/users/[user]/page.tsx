import { PageAccount } from "@/src/components/view/VestiarioPage";
import { getUserWardrobe } from "@/src/actions/actionsDB";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Usuário",
  description: "Usuário",
};

export default async function UserPage({
  params,
}: {
  params: Promise<{ user: string }>;
}) {
  const { user } = await params;
  const items = await getUserWardrobe(Number(user));
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
          Usuário ainda não adquiriu nenhum item.
        </p>
      </div>
    );
  }
  return <PageAccount items={items} />;
}
