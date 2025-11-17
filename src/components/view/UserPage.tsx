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
import { FortniteSingleItem } from "@/src/types/APIType";

export function WardrobeClient({ items }: { items: FortniteSingleItem[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;

    const query = searchQuery.toLowerCase();
    return items.filter((item) => item?.name?.toLowerCase().includes(query));
  }, [items, searchQuery]);

  return (
    <div className="min-h-screen flex justify-center items-start bg-background py-2">
      <ScrollArea className="max-w-7xl w-full">
        <Card className="w-full min-w-none xl:min-w-[1400px] mx-auto border-0 shadow-md">
          <CardHeader>
            <CardTitle className="font-bold text-5xl md:text-7xl shadow-lg text-black font-roboto uppercase bg-yellow-400 px-8 py-4 w-max rounded-2xl">
              Meu Vestiário
            </CardTitle>
          </CardHeader>

          <CardContent className="flex px-0 flex-col space-y-6 w-full">
            <div className="px-4 md:px-8 lg:px-12">
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 px-4 max-w-[1300px] mx-auto">
                {filteredItems.map((item, i) => (
                  <Card
                    key={item.id}
                    className={`group relative overflow-hidden py-0 hover:border-2 border-purple-500/30 
    bg-linear-to-br from-purple-500 to-purple-600 
    hover:border-purple-400 hover:shadow-xl hover:shadow-white/5 
    hover:scale-105 transition-all duration-300 cursor-pointer 
    max-w-[250px] mx-auto w-full animate-in fade-in`}
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    <Link
                      href={`/cosmetics/${encodeURIComponent(item.id)}`}
                      className="relative block aspect-square"
                    >
                      <Image
                        src={
                          item.images?.icon ||
                          item.images?.smallIcon ||
                          item.images?.lego?.large ||
                          "/placeholder.png"
                        }
                        alt={item.name}
                        width={250}
                        height={250}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />

                      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute inset-x-0 bottom-0 h-2/5 flex items-end justify-center pb-4 px-3">
                        <p className="font-bold text-sm sm:text-base text-white text-center drop-shadow-[0_2px_10px_rgba(0,0,0,1)] leading-tight line-clamp-2">
                          {item.name}
                        </p>
                      </div>

                      {item.rarity?.value && (
                        <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-sm border border-yellow-500/50 text-xs font-bold text-yellow-400 shadow-lg">
                          {item.rarity.value}
                        </div>
                      )}
                    </Link>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 space-y-3">
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
