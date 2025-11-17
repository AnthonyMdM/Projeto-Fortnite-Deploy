import type { Metadata } from "next";
import { Poppins, Roboto } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Menu } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@radix-ui/react-navigation-menu";
import Link from "next/link";
import { auth } from "@/src/lib/auth";
import {
  NavigationMenuContent,
  NavigationMenuTrigger,
} from "@/src/components/ui-cn/navigation-menu";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/src/components/ui-cn/sidebar";
import { AppSidebar } from "@/src/components/ui/AppSidebar";

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
  title: "Fortnite",
  description: "Catálogo e loja interativa",
  icons: {
    icon: "/icon.png",
  },
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
        <div className="relative flex w-full min-h-screen overflow-auto text-lg">
          <SidebarProvider defaultOpen={false}>
            <SidebarInset>
              <div className="flex flex-col flex-1 w-full justify-center">
                <NavigationMenu className="flex justify-center p-4 relative z-20 bg-blue-950 shadow-md w-full">
                  <div className="w-7xl">
                    <NavigationMenuList className="flex gap-2 justify-between items-center w-full">
                      <div className="flex gap-3 items-center">
                        <NavigationMenuItem>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/users"
                              className="text-white hover:underline"
                            >
                              Usuários
                            </Link>
                          </NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem className="relative ">
                          <NavigationMenuTrigger className="text-white hover:underline text-lg font-normal">
                            Cosméticos
                          </NavigationMenuTrigger>

                          <NavigationMenuContent className="absolute top-full left-0 mt-2 p-4 bg-blue-900 rounded-lg shadow-lg min-w-[180px] flex flex-col gap-2 border border-white/10">
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
                              <Link
                                href="/shop"
                                className="text-white hover:underline"
                              >
                                Loja
                              </Link>
                            </NavigationMenuLink>
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      </div>
                      {session ? (
                        <SidebarTrigger className="text-white hover:bg-blue-800 p-2 rounded cursor-pointer">
                          <div className="w-8 h-8 flex items-center justify-center">
                            <Menu className="w-full h-full" />
                          </div>
                        </SidebarTrigger>
                      ) : (
                        <div className="flex gap-3">
                          <NavigationMenuItem>
                            <NavigationMenuLink asChild>
                              <Link
                                href="/login"
                                className="text-white hover:underline"
                              >
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
                  </div>
                </NavigationMenu>

                <main className="flex-1 bg-linear-to-br from-blue-600 via-blue-900 to-cyan-800 overflow-auto">
                  <div className="fixed inset-0 bg-[url('/grid-pattern.svg')] opacity-10 pointer-events-none" />
                  <div className="relative z-10 ">
                    {session && <AppSidebar />}

                    <TooltipProvider>{children}</TooltipProvider>
                  </div>
                </main>
              </div>
            </SidebarInset>
          </SidebarProvider>
        </div>
      </body>
    </html>
  );
}
