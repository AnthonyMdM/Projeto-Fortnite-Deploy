import { getAllUsers } from "@/src/actions/actionsDB";
import { PageUsers } from "@/src/components/view/UsersPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fortnite Usuários",
  description: "Todos Usuários",
};

export const revalidate = 3600;
export default async function UsersPage() {

  const initialData = await getAllUsers(1, 20);
  if (initialData.users.length === 0) return <p>Nenhum usuário encontrado</p>;

  return <PageUsers initialData={initialData} />;
}
