import { getAllUsers } from "@/src/actions/actionsDB";
import { PageUsers } from "@/src/components/view/UsersPage";

export const revalidate = 3600; // Revalidar a cada 1 hora
// Ou use: export const dynamic = 'force-static';

export default async function UsersPage() {
  // Buscar primeira página no servidor (build time)
  const initialData = await getAllUsers(1, 20);

  return <PageUsers initialData={initialData} />;
}
