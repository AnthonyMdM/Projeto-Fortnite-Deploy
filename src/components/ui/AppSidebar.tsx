import { findUser } from "@/src/actions/actionsDB";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
} from "@/src/components/ui-cn/sidebar";
import { auth, signOut } from "@/src/lib/auth";
import Image from "next/image";
import Link from "next/link";
import { Tooltip } from "@radix-ui/react-tooltip";
import { TooltipContent, TooltipTrigger } from "@/src/components/ui-cn/tooltip";
export async function AppSidebar() {
  const user = await auth();
  const dados = await findUser(Number(user?.user.id));

  return (
    <Sidebar
      side="right"
      collapsible="offcanvas"
      className="z-50 bg-linear-to-b from-slate-900 to-slate-950 border-l border-slate-800 
                 pt-12"
    >
      <SidebarHeader />

      <SidebarContent className="px-4 py-6">
        <SidebarGroup className="space-y-6">
          <SidebarGroupLabel className="text-sm uppercase tracking-wider text-slate-400">
            Usuário
          </SidebarGroupLabel>

          <SidebarContent>
            <SidebarMenu className="flex flex-col gap-6">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800/60 transition-all border border-slate-700">
                <Image
                  src={dados?.image ?? "/placeholder.png"}
                  width={48}
                  height={48}
                  alt="icone"
                  className="rounded-full border border-slate-600"
                />
                <div className="flex flex-col">
                  <span className="text-white font-semibold">
                    {dados?.name}
                  </span>
                </div>
              </div>
              <Link
                href={"/historico"}
                className="text-white text-sm font-medium p-3 rounded-lg bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700 transition-all"
              >
                Histórico de Compras
              </Link>

              <Link
                href={"/account"}
                className="text-white text-sm font-medium p-3 rounded-lg bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700 transition-all"
              >
                Vestiário
              </Link>

              <div className="flex justify-end mt-2 cursor-pointer">
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center gap-2 bg-blue-700 px-4 py-2 rounded-lg border shadow">
                      <span className="text-sm font-extrabold text-white">
                        {dados?.vbucks}
                      </span>
                      <Image
                        src="https://fortnite-api.com/images/vbuck.png"
                        alt="V-Bucks"
                        width={16}
                        height={16}
                        className="drop-shadow-lg"
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    sideOffset={10}
                    className="bg-black/80 text-white border border-white/20 backdrop-blur-md"
                  >
                    <p>Meus V-Bucks</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
                className="pt-2"
              >
                <button
                  type="submit"
                  className="w-full text-center text-red-400 hover:text-red-300 hover:bg-red-400/10 
                  p-3 rounded-lg font-semibold transition-all cursor-pointer"
                >
                  Sair
                </button>
              </form>
            </SidebarMenu>
          </SidebarContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-4 py-4 border-t border-slate-800 text-center text-slate-500 text-xs">
        © Anthony 2025
      </SidebarFooter>
    </Sidebar>
  );
}
