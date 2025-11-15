"use client";

import { useState, useMemo } from "react";
import { Search, Calendar, Package } from "lucide-react";
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

export function PageHistorico({ offers }: { offers: OfferBuy[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const formatDate = (date: Date | string) =>
    new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  // 👉 Filtrar por texto + data
  const filtered = useMemo(() => {
    return offers.filter((offer) => {
      const matchText =
        searchQuery.trim().length === 0 ||
        offer.offerId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchDate =
        dateFilter.trim().length === 0 ||
        new Date(offer.purchasedAt).toISOString().slice(0, 10) === dateFilter; // YYYY-MM-DD

      return matchText && matchDate;
    });
  }, [offers, searchQuery, dateFilter]);

  return (
    <div className="min-h-screen flex justify-center items-start bg-background py-6">
      <ScrollArea className="w-full">
        <Card className="w-full min-w-none xl:min-w-[1300px] mx-auto border-0 shadow-md">
          <CardHeader>
            <CardTitle className="font-bold text-5xl md:text-7xl shadow-lg text-black font-roboto uppercase bg-purple-500 px-8 py-4 w-max rounded-2xl">
              Compras do Usuário
            </CardTitle>
          </CardHeader>

          <CardContent className="flex px-0 flex-col space-y-6 w-full">
            {/* 🔍 Filtros */}
            <div className="space-y-4 px-4 md:px-8 lg:px-12">
              <div className="flex flex-col md:flex-row gap-4 md:items-center">
                {/* Buscar por OfferId */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white h-4 w-4" />
                  <Input
                    className="border-white border-2 pl-10 focus-visible:ring-2 focus-visible:ring-white"
                    placeholder="Buscar por ID da oferta..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Filtro de Data */}
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

            {/* Lista de Ofertas */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 px-4 max-w-[1300px] mx-auto mt-2">
              {filtered.length > 0 ? (
                filtered.map((offer) => (
                  <Link
                    key={offer.id}
                    href={`/historico/${offer.id}`} // 👉 Vai para a página de detalhes
                  >
                    <Card
                      className="
                      group relative overflow-hidden cursor-pointer
                      border-2 border-purple-500/40 
                      bg-linear-to-br from-purple-600 to-purple-700
                      hover:border-purple-300 hover:shadow-xl 
                      hover:shadow-white/5 hover:scale-[1.02]
                      transition-all duration-300
                    "
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          {/* Ícone */}
                          <div className="h-16 w-16 flex items-center justify-center rounded-xl bg-purple-400/20 border border-purple-300/30">
                            <Package className="h-8 w-8 text-purple-200" />
                          </div>

                          {/* Informações */}
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-white truncate">
                              Oferta: {offer.offerId}
                            </h3>

                            <p className="text-sm text-white/70">
                              Comprada em {formatDate(offer.purchasedAt)}
                            </p>

                            <div className="mt-3 text-white/80 text-sm flex gap-4">
                              <span>
                                💰 {offer.price.toLocaleString()} V-Bucks
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
