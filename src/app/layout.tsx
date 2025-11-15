// app/layout.tsx
import type { Metadata } from "next";
import { Poppins, Roboto } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@radix-ui/react-navigation-menu";
import Link from "next/link";
import { auth, signOut } from "../lib/auth";
import {
  NavigationMenuContent,
  NavigationMenuTrigger,
} from "../components/ui-cn/navigation-menu";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-poppins",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Fortnite Store",
  description: "Catálogo e loja interativa",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="pt-BR">
      <body className={`${poppins.variable} ${roboto.variable} antialiased`}>
        {/* 🔹 Menu de navegação */}
        <NavigationMenu className="p-4 relative z-20 bg-blue-950 shadow-md">
          <NavigationMenuList className="flex gap-2 justify-between items-center">
            {/* 🔹 Cosméticos com submenu ajustado */}
            <div className="flex gap-3 items-center">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/users" className="text-white hover:underline">
                    Usuários
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem className="relative">
                <NavigationMenuTrigger className="text-white hover:underline">
                  Cosméticos
                </NavigationMenuTrigger>

                <NavigationMenuContent
                  className="
                  absolute top-full left-0 mt-2
                  p-4 bg-blue-900 rounded-lg shadow-lg
                  min-w-[180px] flex flex-col gap-2
                  border border-white/10
                "
                >
                  <NavigationMenuLink asChild>
                    <Link
                      href="/cosmetics"
                      className="text-white hover:underline"
                    >
                      Todos
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/cosmetics/new"
                      className="text-white hover:underline"
                    >
                      Novos
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link href="/shop" className="text-white hover:underline">
                      Loja
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </div>

            {/* 🔹 Se o usuário estiver logado */}
            {session ? (
              <div className=" flex gap-3">
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/account"
                      className="text-white hover:underline"
                    >
                      Perfil
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <form
                    action={async () => {
                      "use server";
                      await signOut();
                    }}
                  >
                    <button
                      type="submit"
                      className="text-white hover:underline bg-transparent border-none cursor-pointer"
                    >
                      Sair
                    </button>
                  </form>
                </NavigationMenuItem>
              </div>
            ) : (
              <div className=" flex gap-3">
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/login" className="text-white hover:underline">
                      Login
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/register"
                      className="text-white hover:underline"
                    >
                      Registre-se
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </div>
            )}
          </NavigationMenuList>
        </NavigationMenu>

        {/* 🔹 Layout principal */}
        <div className="min-h-screen bg-linear-to-br from-blue-600 via-blue-900 to-cyan-800 overflow-auto">
          <div className="fixed inset-0 bg-[url('/grid-pattern.svg')] opacity-10 pointer-events-none" />
          <div className="relative z-10">
            <TooltipProvider>{children}</TooltipProvider>
          </div>
        </div>
      </body>
    </html>
  );
}
