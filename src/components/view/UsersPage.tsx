"use client";

import { useState, useEffect } from "react";
import { Search, Calendar } from "lucide-react";
import Image from "next/image";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui-cn/avatar";
import { Input } from "@/src/components/ui-cn/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui-cn/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/src/components/ui-cn/pagination";
import { ScrollArea } from "@/src/components/ui-cn/scroll-area";
import { Tooltip } from "@radix-ui/react-tooltip";
import { TooltipContent, TooltipTrigger } from "@/src/components/ui-cn/tooltip";
import { getAllUsers, searchUsers } from "@/src/actions/actionsDB";
import Link from "next/link";

export type SafeUser = {
  id: number;
  name: string | null;
  email: string;
  image: string | null;
  vbucks: number;
  createdAt: Date;
};

interface UsersPageClientProps {
  initialData: {
    users: SafeUser[];
    total: number;
    totalPages: number;
    currentPage: number;
  };
}
export const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
export function PageUsers({ initialData }: UsersPageClientProps) {
  const [users, setUsers] = useState<SafeUser[]>(initialData.users);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialData.totalPages);
  const [total, setTotal] = useState(initialData.total);
  const [loading, setLoading] = useState(false);
  const pageSize = 20;

  useEffect(() => {
    if (
      currentPage === 1 &&
      !searchQuery.trim() &&
      users.length === initialData.users.length
    ) {
      return;
    }

    async function loadUsers() {
      setLoading(true);
      try {
        if (searchQuery.trim()) {
          const result = await searchUsers(searchQuery, currentPage, pageSize);
          setUsers(result.users);
          setTotal(result.total);
          setTotalPages(result.totalPages);
        } else {
          const result = await getAllUsers(currentPage, pageSize);
          setUsers(result.users);
          setTotal(result.total);
          setTotalPages(result.totalPages);
        }
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, [currentPage, searchQuery]);

  useEffect(() => {
    if (searchQuery.trim()) {
      setCurrentPage(1);
    }
  }, [searchQuery]);

  const mudarPagina = (novaPagina: number) => {
    setLoading(true);
    setCurrentPage(novaPagina);
    setTimeout(() => {
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 300);
  };

  const gerarPaginasVisiveis = () => {
    const paginas: (number | string)[] = [];
    const maxPaginasVisiveis = 5;

    if (totalPages <= maxPaginasVisiveis) {
      for (let i = 1; i <= totalPages; i++) {
        paginas.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) paginas.push(i);
        paginas.push("ellipsis");
        paginas.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        paginas.push(1);
        paginas.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) paginas.push(i);
      } else {
        paginas.push(1);
        paginas.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++)
          paginas.push(i);
        paginas.push("ellipsis");
        paginas.push(totalPages);
      }
    }

    return paginas;
  };

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return email.charAt(0).toUpperCase();
  };

  return (
    <div className="min-h-screen flex justify-center items-start bg-background py-2">
      <ScrollArea className="max-w-7xl w-full">
        <Card className="w-full border-0 shadow-md">
          <CardHeader className="px-0">
            <CardTitle className="font-bold text-5xl md:text-7xl shadow-lg text-black font-roboto uppercase bg-yellow-400 px-8 py-4 w-max rounded-2xl">
              Todos os Usuários
            </CardTitle>
          </CardHeader>

          <CardContent className="flex px-0 flex-col space-y-6 w-full">
            <div className="space-y-4 px-2">
              <div className="flex flex-col sm:flex-row md:items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white h-4 w-4" />
                      <Input
                        className="flex-1 border-white border-2 pl-10 focus-visible:ring-2 focus-visible:ring-white"
                        placeholder="Buscar por nome ou email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    sideOffset={10}
                    className="bg-black/80 text-white border border-white/20 backdrop-blur-md"
                  >
                    <p>Buscar usuários pelo nome ou email</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="text-sm font-roboto text-muted-foreground text-right mt-2">
                {total} usuários encontrados
                {totalPages > 1 && ` • Página ${currentPage} de ${totalPages}`}
              </div>
            </div>

            <div className="overflow-hidden w-full relative min-h-[500px]">
              {loading && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-lg font-semibold text-blue-500">
                      Carregando...
                    </p>
                  </div>
                </div>
              )}

              {users.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 px-4 max-w-[1300px] mx-auto mt-2">
                    {users.map((user, i) => (
                      <Card
                        key={user.id}
                        className={`group relative overflow-hidden border-2 border-blue-500/30 bg-linear-to-br from-blue-500 to-blue-600 hover:border-blue-400 hover:shadow-xl hover:shadow-white/5 hover:scale-105 transition-all duration-300 py-2 ${
                          loading
                            ? "opacity-50 pointer-events-none"
                            : "animate-in fade-in duration-300"
                        }`}
                        style={{ animationDelay: `${i * 30}ms` }}
                      >
                        <Tooltip>
                          <TooltipTrigger>
                            <Link href={`/users/${user.id}`}>
                              <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                  <Avatar className="h-16 w-16 border-2 border-white/20">
                                    <AvatarImage
                                      src={user.image || undefined}
                                    />
                                    <AvatarFallback className="bg-linear-to-br from-yellow-400 to-yellow-600 text-black font-bold text-xl">
                                      {getInitials(user.name, user.email)}
                                    </AvatarFallback>
                                  </Avatar>

                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-lg text-white truncate">
                                      {user.name || "Usuário sem nome"}
                                    </h3>
                                    <p className="text-sm text-white/80 truncate">
                                      {user.email}
                                    </p>

                                    <div className="flex items-baseline gap-4 mt-3 text-xs text-white/70">
                                      <div className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {formatDate(user.createdAt)}
                                      </div>
                                      <div className="flex items-center gap-1 bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full font-bold text-sm mt-3 w-max">
                                        <Image
                                          src="https://fortnite-api.com/images/vbuck.png"
                                          alt="V-Bucks"
                                          width={16}
                                          height={16}
                                        />
                                        {user.vbucks.toLocaleString()}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent
                            sideOffset={10}
                            className="bg-black/80 text-white border border-white/20 backdrop-blur-md"
                          >
                            <p>Clique para ver os items desse usuário</p>
                          </TooltipContent>
                        </Tooltip>
                      </Card>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="mt-8 pb-6">
                      <Pagination className="bg-blue-950/50 w-max rounded-md mx-auto">
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() =>
                                mudarPagina(Math.max(1, currentPage - 1))
                              }
                              className={
                                currentPage === 1 || loading
                                  ? "pointer-events-none opacity-50"
                                  : "cursor-pointer"
                              }
                            />
                          </PaginationItem>

                          {gerarPaginasVisiveis().map((pagina, idx) => (
                            <PaginationItem key={idx}>
                              {pagina === "ellipsis" ? (
                                <PaginationEllipsis />
                              ) : (
                                <PaginationLink
                                  onClick={() => mudarPagina(pagina as number)}
                                  isActive={currentPage === pagina}
                                  className={`cursor-pointer border rounded-md text-white transition-all 
                                    ${
                                      loading
                                        ? "pointer-events-none opacity-50"
                                        : ""
                                    }
                                    ${
                                      currentPage === pagina
                                        ? "border-white bg-white/10"
                                        : "border-transparent hover:border-white"
                                    }
                                  `}
                                >
                                  {pagina}
                                </PaginationLink>
                              )}
                            </PaginationItem>
                          ))}

                          <PaginationItem>
                            <PaginationNext
                              onClick={() =>
                                mudarPagina(
                                  Math.min(totalPages, currentPage + 1)
                                )
                              }
                              className={
                                currentPage === totalPages || loading
                                  ? "pointer-events-none opacity-50"
                                  : "cursor-pointer"
                              }
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 space-y-3">
                  <div className="text-6xl">🔍</div>
                  <p className="text-center text-slate-400 text-lg font-medium">
                    Nenhum usuário encontrado
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </ScrollArea>
    </div>
  );
}
