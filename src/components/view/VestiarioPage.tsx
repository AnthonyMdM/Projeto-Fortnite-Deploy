"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Input } from "@/src/components/ui-cn/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui-cn/card";
import { ScrollArea } from "@/src/components/ui-cn/scroll-area";
import { Search } from "lucide-react";
import Link from "next/link";
import { ItemsBuy } from "@prisma/client";
import { formatDate } from "./UsersPage";

export function PageAccount({ items }: { items: ItemsBuy[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;

    const query = searchQuery.toLowerCase();
    return items.filter((item) => item?.name?.toLowerCase().includes(query));
  }, [items, searchQuery]);

  return (
    <div className="min-h-screen flex justify-center py-2">
      <ScrollArea className="max-w-7xl w-full">
        <Card className="w-full border-0 shadow-md gap-3 md:gap-6">
          <CardHeader className="px-0 md:pl-0 pl-2">
            <CardTitle className="font-bold text-4xl sm:text-5xl md:text-7xl shadow-lg text-black font-roboto uppercase bg-yellow-400 py-2 px-4 md:px-8 md:py-4 w-max rounded-2xl break-word ">
              Meu Vestiário
            </CardTitle>
          </CardHeader>

          <CardContent className="flex px-0 flex-col space-y-6 w-full">
            <div className="px-2 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white h-4 w-4" />
                <Input
                  className="border-white border-2 pl-10 focus-visible:ring-2 focus-visible:ring-white"
                  placeholder="Buscar item..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="text-sm font-roboto text-muted-foreground text-right mt-2">
                {filteredItems.length} itens encontrados
              </div>
            </div>

            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 px-4 md:max-w-[1300px] ">
                {filteredItems.map((item, i) => (
                  <Link
                    key={i}
                    href={`/cosmetics/${encodeURIComponent(item.itemId)}`}
                  >
                    <Card
                      className="
                                        group relative overflow-hidden cursor-pointer
                                        border-2 border-blue-600/30 bg-linear-to-br from-blue-600 to-blue-00 hover:border-blue-400 hover:shadow-xl 
                                        hover:shadow-white/5 hover:scale-[1.02]
                                        transition-all duration-300
                                      "
                    >
                      <CardContent className="py-1 px-2">
                        <div className="flex flex-col gap-4">
                          <div className="relative w-full h-32 md:h-60 rounded-xl overflow-hidden shadow-black/40 group transition-all duration-300">
                            <Image
                              src={item.image ?? "/placeholder.png"}
                              alt={item.name ?? "Item"}
                              fill
                              className="object-cover object-center transition-all duration-300 group-hover:scale-105"
                            />

                            <div className="absolute inset-x-0 bottom-0 h-2/5 flex items-end justify-center pb-3 px-3">
                              <p className="font-bold text-2xl text-white text-center drop-shadow-[0_2px_10px_rgba(0,0,0,1)] leading-tight line-clamp-2">
                                {item.name ?? "item"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 justify-between px-2">
                            <p className="text-sm text-white drop-shadow-md">
                              {formatDate(item.purchasedAt)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 md:h-64 space-y-3">
                <div className="text-6xl">🎒</div>
                <p className="text-center text-slate-400 text-lg font-medium">
                  Nenhum item encontrado
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </ScrollArea>
    </div>
  );
}
