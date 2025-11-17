"use client";

import { useState, useMemo } from "react";
import { Search, Calendar } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui-cn/card";
import { Input } from "@/src/components/ui-cn/input";
import { ScrollArea } from "@/src/components/ui-cn/scroll-area";
import { OfferBuy } from "@prisma/client";
import Image from "next/image";

export function PageHistorico({ offers }: { offers: OfferBuy[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const formatDate = (date: Date | string) =>
    new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const filtered = useMemo(() => {
    return offers.filter((offer) => {
      const matchText =
        searchQuery.trim().length === 0 ||
        offer.offerId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchDate =
        dateFilter.trim().length === 0 ||
        new Date(offer.purchasedAt).toISOString().slice(0, 10) === dateFilter; 

      return matchText && matchDate;
    });
  }, [offers, searchQuery, dateFilter]);

  return (
    <div className="min-h-screen flex justify-center items-start bg-background py-2">
      <ScrollArea className=" max-w-7xl w-full">
        <Card className="w-full border-0 shadow-md ">
          <CardHeader className="px-0">
            <CardTitle className="font-bold text-5xl md:text-7xl shadow-lg text-black font-roboto uppercase bg-yellow-400 px-8 py-4 w-max rounded-2xl">
              Compras do Usuário
            </CardTitle>
          </CardHeader>

          <CardContent className="flex px-0 flex-col space-y-6 w-full">
            <div className="space-y-4 px-4 md:px-8 lg:px-12">
              <div className="flex flex-col md:flex-row gap-4 md:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white h-4 w-4" />
                  <Input
                    className="border-white border-2 pl-10 focus-visible:ring-2 focus-visible:ring-white"
                    placeholder="Buscar por ID da oferta..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="relative w-full md:w-64">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white h-4 w-4" />
                  <Input
                    type="date"
                    className="border-white border-2 pl-10 text-white focus-visible:ring-2 focus-visible:ring-white bg-transparent"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  />
                </div>
              </div>

              <p className="text-sm text-muted-foreground text-right">
                {filtered.length} ofertas encontradas
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-w-[1300px] mx-auto mt-2">
              {filtered.length > 0 ? (
                filtered.map((offer) => (
                  <Link
                    key={offer.id}
                    href={`/historico/${offer.id}`} 
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
                          <div className="relative w-full h-60 rounded-xl overflow-hidden shadow-black/40 group transition-all duration-300">
                            <Image
                              src={offer.image ?? "/placeholder.png"}
                              alt={offer.offerTag ?? "Oferta"}
                              fill
                              className="object-cover object-center transition-all duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-x-0 bottom-0 h-2/5 flex items-end justify-center pb-3 px-3">
                              <p className="font-bold text-2xl text-white text-center drop-shadow-[0_2px_10px_rgba(0,0,0,1)] leading-tight line-clamp-2">
                                {offer.offerTag ?? "Oferta"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 justify-between px-2">
                            <p className="text-sm text-white drop-shadow-md">
                              {formatDate(offer.purchasedAt)}
                            </p>

                            <div
                              className="flex items-center gap-2
        bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg
        border border-blue-400/40 shadow-lg"
                            >
                              <Image
                                src="https://fortnite-api.com/images/vbuck.png"
                                alt="V-Bucks"
                                width={32}
                                height={32}
                                className="drop-shadow-lg"
                              />
                              <span className="font-extrabold text-3xl text-white tracking-wide drop-shadow-lg">
                                {offer.price.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center h-64 space-y-3">
                  <div className="text-6xl">🛒</div>
                  <p className="text-center text-slate-400 text-lg font-medium">
                    Nenhuma oferta encontrada
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
