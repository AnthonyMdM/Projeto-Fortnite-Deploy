"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui-cn/card";
import { ScrollArea } from "@/src/components/ui-cn/scroll-area";

import { ShopEntryItem, ShopGroup } from "@/src/types/cosmeticsType";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/src/components/ui-cn/carousel";
import { Filter } from "lucide-react";
import { Tooltip } from "@radix-ui/react-tooltip";
import { TooltipContent, TooltipTrigger } from "../ui-cn/tooltip";

export default function PageShop({
  groupedBundles,
  groupedItems,
  listOffersIds,
  listItemsIds,
}: {
  groupedBundles: ShopGroup[];
  groupedItems: ShopGroup[];
  listItemsIds?: string[];
  listOffersIds?: string[];
}) {
  const [expandedBundles, setExpandedBundles] = useState<Set<string>>(
    new Set()
  );
  const [selectedBundleCategory, setSelectedBundleCategory] = useState<
    string | null
  >(null);
  const [selectedItemCategory, setSelectedItemCategory] = useState<
    string | null
  >(null);
  const [filterHovered, setFilterHovered] = useState(false);

  // Função para scroll suave até a seção
  const scrollToSection = (layoutId: string) => {
    const element = document.getElementById(`section-${layoutId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const toggleBundleExpanded = (bundleId: string) => {
    setExpandedBundles((prev) => {
      const next = new Set(prev);
      if (next.has(bundleId)) next.delete(bundleId);
      else next.add(bundleId);
      return next;
    });
  };

  const getMainImage = (entry: ShopEntryItem) =>
    ((entry.newDisplayAsset?.renderImages?.[0] as any)?.image as
      | string
      | undefined) ??
    (entry.newDisplayAsset?.renderImages?.[0] as unknown as string) ??
    entry.brItems?.[0]?.images?.icon ??
    entry.tracks?.[0]?.albumArt ??
    entry.legoKits?.[0]?.images.wide ??
    entry.instruments?.[0]?.images.large ??
    entry.cars?.[0]?.images?.large ??
    "/placeholder.png";

  // Filtrar dados baseado nas categorias selecionadas
  const filteredData = useMemo(() => {
    return {
      bundles: groupedBundles,
      items: groupedItems,
    };
  }, [groupedBundles, groupedItems]);

  const hasActiveFilters =
    selectedBundleCategory !== null || selectedItemCategory !== null;

  // Componente reutilizável para renderizar um bundle/pacote card
  const BundleCard = ({
    entry,
    bundleId,
  }: {
    entry: ShopEntryItem;
    bundleId: string;
  }) => {
    const image = getMainImage(entry);
    const isExpanded = expandedBundles.has(bundleId);

    const hasItems =
      (entry.brItems?.length ?? 0) +
      (entry.tracks?.length ?? 0) +
      (entry.instruments?.length ?? 0) +
      (entry.legoKits?.length ?? 0) +
      (entry.cars?.length ?? 0);

    // Nome do item vendável
    const itemName = entry.bundle?.name || entry.devName;

    // Função auxiliar: descobre o grupo de itens e o tipo
    const getItemsGroup = () => {
      if (entry.brItems?.length)
        return { items: entry.brItems, type: "britem", title: "Cosméticos" };
      if (entry.tracks?.length)
        return { items: entry.tracks, type: "track", title: "Músicas" };
      if (entry.cars?.length)
        return { items: entry.cars, type: "cars", title: "Carros" };
      if (entry.instruments?.length)
        return {
          items: entry.instruments,
          type: "instruments",
          title: "Carros",
        };
      if (entry.legoKits?.length)
        return { items: entry.legoKits, type: "legoKits", title: "Carros" };
      return null;
    };

    const itemsGroup = getItemsGroup();

    return (
      <Link
        href={`/shop/item/${encodeURIComponent(entry.offerId)}`}
        className="block relative w-full"
      >
        <div className="group block z-10 hover:z-20 relative overflow-hidden border-2 border-blue-500/30 bg-linear-to-br from-blue-500 to-blue-600 hover:border-blue-400 hover:shadow-xl hover:shadow-white/5 transition-all duration-300 rounded-2xl cursor-pointer hover:scale-105">
          {/* Link para a página do item */}

          {/* Imagem principal */}
          <div className="relative w-full aspect-video overflow-hidden">
            <Image
              src={image}
              alt={itemName}
              fill
              className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).classList.add("object-contain");
              }}
            />

            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

            {/* Preço */}
            {listOffersIds?.includes(entry.offerId) ? (
              <span className="absolute top-4 right-4 bg-green-600 text-white text-sm px-2 py-1 rounded-md">
                Adquirido!
              </span>
            ) : (
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/70 backdrop-blur-sm px-3 py-2 rounded-lg text-white font-bold text-base shadow-lg z-10">
                <>
                  {entry.regularPrice &&
                  entry.regularPrice !== entry.finalPrice ? (
                    <>
                      <span className="text-gray-400 line-through text-sm mr-2">
                        {entry.regularPrice.toLocaleString()}
                      </span>
                      <span className="text-lg font-extrabold text-white">
                        {entry.finalPrice.toLocaleString()}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-lg font-extrabold text-white">
                        {entry.finalPrice.toLocaleString()}
                      </span>
                      <Image
                        src="https://fortnite-api.com/images/vbuck.png"
                        alt="V-Bucks"
                        width={24}
                        height={24}
                        className="inline-block"
                      />
                    </>
                  )}
                </>
              </div>
            )}

            {/* Nome e Badge */}
            <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end pb-6 px-6 z-10">
              {entry.inDate &&
                new Date(entry.inDate).getTime() >
                  Date.now() - 15 * 24 * 60 * 60 * 1000 && (
                  <span className="inline-block mb-2 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white rounded-full bg-red-600! shadow-lg">
                    Novo!
                  </span>
                )}
              <h3 className="font-bold text-2xl sm:text-3xl md:text-4xl text-white text-center drop-shadow-[0_1px_2px_rgba(0,0,0,1)] leading-tight line-clamp-2 mb-3">
                {itemName}
              </h3>
              <div className="flex flex-wrap gap-3 justify-center items-center">
                {/* Badge de Pacote/Temática */}
                <span className="bg-yellow-400/30 border border-yellow-400/50 text-yellow-300 px-4 py-2 text-sm font-bold rounded-lg uppercase shadow-lg">
                  Pacote
                </span>

                {hasItems > 0 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleBundleExpanded(bundleId);
                        }}
                        className="cursor-pointer bg-yellow-500 hover:bg-yellow-400 px-4 py-2 text-black rounded-lg font-semibold text-sm transition-colors"
                      >
                        {isExpanded ? "▼ Ocultar" : "▶ Ver detalhes"}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-black/80 text-white border border-white/20 backdrop-blur-md">
                      <p>Ver itens inclusos</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>
          </div>

          {/* Itens do pacote (expansível) */}
          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              isExpanded
                ? "max-h-[2000px] opacity-100 border-t-2 border-white/10 bg-black/20 p-6 space-y-4"
                : "max-h-0 opacity-0"
            }`}
          >
            {itemsGroup && (
              <div>
                <h4 className="font-bold text-lg text-white text-left mb-5">
                  {itemsGroup.title} ({itemsGroup.items.length})
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {itemsGroup.items.map((item: any, j: number) => {
                    const itemName = item.name ?? item.title ?? "Item";
                    const image =
                      item.images?.icon ??
                      item.images?.smallIcon ??
                      item.albumArt ??
                      item.images?.large ??
                      "/placeholder.png";

                    return (
                      <div
                        key={j}
                        className="group/item relative aspect-square bg-slate-900/50 border border-white/10 rounded-xl overflow-hidden transition-all duration-300"
                      >
                        <div className="relative w-full h-full">
                          <Image
                            src={image}
                            alt={itemName}
                            fill
                            className="object-cover "
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover/item:opacity-100 transition-opacity" />
                          {listItemsIds?.includes(item.id) && (
                            <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-md shadow-md z-10">
                              Adquirido!
                            </span>
                          )}
                          <div className="absolute inset-x-0 bottom-0 h-2/5 flex items-end justify-center pb-2 px-2">
                            {entry.inDate &&
                              new Date(entry.inDate).getTime() >
                                Date.now() - 15 * 24 * 60 * 60 * 1000 && (
                                <span className="inline-block mb-2 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white rounded-full bg-red-600! shadow-lg">
                                  Novo!
                                </span>
                              )}
                            <p className="font-bold text-xs text-white text-center leading-tight line-clamp-2">
                              {itemName}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen relative">
      {/* Filtro Lateral Expansível */}
      <div
        className="fixed left-0 top-1/4 z-50 group"
        onMouseEnter={() => setFilterHovered(true)}
        onMouseLeave={() => setFilterHovered(false)}
      >
        {/* Tab visível */}
        <div className="relative">
          <div className="absolute left-0 top-10 w-max h-max p-3 bg-linear-to-r from-blue-600 to-blue-500 rounded-r-2xl shadow-2xl flex flex-col items-center justify-center gap-2 cursor-pointer border-2 border-blue-400/50 hover:border-blue-300 transition-all group-hover:w-14">
            <Filter className="w-6 h-6 text-white" />
            {hasActiveFilters && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-blue-600 animate-pulse" />
            )}
          </div>

          {/* Painel Expandido */}
          <div
            className={`absolute left-0 top-0 bg-slate-900/98 backdrop-blur-md border-2 border-blue-500/40 rounded-r-2xl shadow-2xl transition-all duration-300 overflow-hidden ${
              filterHovered
                ? "w-80 opacity-100 pointer-events-auto"
                : "w-0 opacity-0 pointer-events-none"
            }`}
          >
            <div className="p-6 space-y-6 w-80 max-h-[70vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-blue-500/30">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Filter className="w-6 h-6 text-blue-400" />
                  Categorias
                </h2>
              </div>

              {/* Pacotes/Bundles */}
              {groupedBundles.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-2">
                    <span className="text-lg">📦</span> Pacotes
                  </h3>
                  <div className="space-y-2">
                    {groupedBundles.map((group) => (
                      <button
                        key={group.layoutId}
                        onClick={() => {
                          setSelectedBundleCategory(
                            selectedBundleCategory === group.layoutId
                              ? null
                              : group.layoutId
                          );
                          setSelectedItemCategory(null);
                          scrollToSection(group.layoutId);
                        }}
                        className={`w-full px-4 py-3 rounded-lg text-left text-sm font-medium transition-all flex items-center justify-between group/btn ${
                          selectedBundleCategory === group.layoutId
                            ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/30 border-2 border-yellow-400"
                            : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border-2 border-transparent hover:border-yellow-500/30"
                        }`}
                      >
                        <span>{group.layoutName}</span>
                        <span className="text-xs opacity-70">
                          ({group.entries.length})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Separator */}
              {groupedBundles.length > 0 && groupedItems.length > 0 && (
                <div className="border-t border-blue-500/20"></div>
              )}

              {/* Items Avulsos */}
              {groupedItems.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
                    <span className="text-lg">🎨</span> Itens Avulsos
                  </h3>
                  <div className="space-y-2">
                    {groupedItems.map((group) => (
                      <button
                        key={group.layoutId}
                        onClick={() => {
                          setSelectedItemCategory(
                            selectedItemCategory === group.layoutId
                              ? null
                              : group.layoutId
                          );
                          setSelectedBundleCategory(null);
                          scrollToSection(group.layoutId);
                        }}
                        className={`w-full px-4 py-3 rounded-lg text-left text-sm font-medium transition-all flex items-center justify-between group/btn ${
                          selectedItemCategory === group.layoutId
                            ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30 border-2 border-blue-400"
                            : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border-2 border-transparent hover:border-blue-500/30"
                        }`}
                      >
                        <span>{group.layoutName}</span>
                        <span className="text-xs opacity-70">
                          ({group.entries.length})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Info de Filtros Ativos */}
              {hasActiveFilters && (
                <div className="pt-3 border-t border-blue-500/30">
                  <p className="text-center text-xs text-slate-400">
                    Categoria selecionada
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="min-h-screen flex justify-center items-start py-2">
        <ScrollArea>
          <Card className="w-full min-w-none xl:min-w-[1400px] mx-auto border-0 shadow-md">
            <CardHeader>
              <CardTitle className="font-bold text-5xl md:text-7xl shadow-lg text-black font-roboto uppercase bg-yellow-400 px-8 py-4 w-max rounded-2xl">
                Loja Fortnite
              </CardTitle>
            </CardHeader>

            <CardContent className="flex px-0 flex-col space-y-12 w-full">
              {/* PACOTES/BUNDLES AGRUPADOS */}
              {filteredData.bundles.map((group) => (
                <section
                  key={group.layoutId}
                  id={`section-${group.layoutId}`}
                  className="space-y-6 scroll-mt-20"
                >
                  {/* Título da seção */}
                  <div className="flex items-center gap-3 px-4 md:px-8 lg:px-12">
                    <div className="h-1 flex-1 bg-linear-to-r from-transparent via-yellow-400 to-yellow-400 rounded-full" />
                    <h2 className="text-2xl md:text-4xl font-bold text-white uppercase tracking-wide whitespace-nowrap">
                      {group.layoutName}
                    </h2>
                    <div className="h-1 flex-1 bg-linear-to-l from-transparent via-yellow-400 to-yellow-400 rounded-full" />
                  </div>

                  {/* Carrossel de Bundles */}
                  <div className="relative w-full px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
                    <Carousel
                      opts={{
                        align: "start",
                        loop: group.entries.length > 2,
                      }}
                      className="w-full"
                    >
                      <CarouselContent className="-ml-2">
                        {group.entries.map((entry, i) => {
                          const bundleId = `${group.layoutId}-${i}`;
                          return (
                            <CarouselItem
                              key={bundleId}
                              className="pl-2 basis-full md:basis-1/2 xl:basis-1/2"
                            >
                              <div className="h-full max-w-2xl mx-auto">
                                <BundleCard entry={entry} bundleId={bundleId} />
                              </div>
                            </CarouselItem>
                          );
                        })}
                      </CarouselContent>

                      {group.entries.length > 2 && (
                        <>
                          <CarouselPrevious className="left-0 bg-black/80 hover:bg-black/60 h-12 w-12 rounded-md cursor-pointer" />
                          <CarouselNext className="right-0 bg-black/80 hover:bg-black/60 h-12 w-12 rounded-md cursor-pointer" />
                        </>
                      )}
                    </Carousel>
                  </div>

                  {/* Itens relacionados ao mesmo layout */}
                  {filteredData.items
                    .filter((groups) => groups.layoutId === group.layoutId)
                    .map((groups, j) => (
                      <div
                        key={j}
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 max-w-[1300px] mx-auto"
                      >
                        {groups.entries.map((entry, i) => {
                          const image = getMainImage(entry);
                          const itemName =
                            entry.brItems?.[0]?.name ??
                            entry.tracks?.[0]?.title ??
                            entry.cars?.[0]?.name ??
                            entry.devName;

                          return (
                            <Card
                              key={i}
                              className="group relative overflow-hidden border-2 border-blue-500/30 bg-linear-to-br from-blue-500 to-blue-600 hover:border-blue-400 hover:shadow-xl hover:shadow-white/5 hover:scale-105 transition-all duration-300 cursor-pointer max-w-[250px] mx-auto w-full"
                              style={{ animationDelay: `${i * 30}ms` }}
                            >
                              <Link
                                href={`/shop/item/${encodeURIComponent(
                                  entry.offerId
                                )}`}
                                className="block aspect-square"
                              >
                                <Image
                                  src={image}
                                  alt={itemName}
                                  fill
                                  loading="lazy"
                                  className="object-cover "
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

                                <div className="absolute inset-x-0 bottom-0 h-2/5 flex items-end justify-center pb-4 px-3">
                                  <p className="font-bold text-sm sm:text-base text-white text-center drop-shadow-[0_2px_10px_rgba(0,0,0,1)] leading-tight line-clamp-2">
                                    {itemName}
                                  </p>
                                </div>

                                {listOffersIds?.includes(entry.offerId) ? (
                                  <span className="absolute top-4 right-4 bg-green-600 text-white text-sm px-2 py-1 rounded-md">
                                    Adquirido!
                                  </span>
                                ) : (
                                  <div className="absolute top-2 right-4 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg text-white font-bold text-sm shadow-lg z-10">
                                    {entry.regularPrice &&
                                    entry.regularPrice !== entry.finalPrice ? (
                                      <>
                                        <span className="text-gray-400 line-through text-sm">
                                          {entry.regularPrice.toLocaleString()}
                                        </span>
                                        <span className="text-lg font-extrabold text-white">
                                          {entry.finalPrice.toLocaleString()}
                                        </span>
                                      </>
                                    ) : (
                                      <span>
                                        {entry.finalPrice.toLocaleString()}
                                      </span>
                                    )}
                                    <Image
                                      src="https://fortnite-api.com/images/vbuck.png"
                                      alt="V-Bucks"
                                      width={16}
                                      height={16}
                                      className="inline-block"
                                    />
                                  </div>
                                )}

                                {entry.brItems?.[0]?.rarity?.value && (
                                  <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-yellow-400 border border-yellow-500/50 shadow-lg">
                                    {entry.brItems[0].rarity.value}
                                  </div>
                                )}
                              </Link>
                            </Card>
                          );
                        })}
                      </div>
                    ))}
                </section>
              ))}

              {/* ITENS INDIVIDUAIS AGRUPADOS */}
              {filteredData.items
                .filter(
                  (group) =>
                    !filteredData.bundles.some(
                      (bundle) => bundle.layoutName === group.layoutName
                    )
                )
                .map((group) => (
                  <section
                    key={group.layoutId}
                    id={`section-${group.layoutId}`}
                    className="space-y-6 px-4 md:px-8 scroll-mt-20"
                  >
                    {/* 🔹 Título e barra decorativa */}
                    <div className="flex items-center gap-3">
                      <div className="h-1 flex-1 bg-linear-to-r from-transparent via-blue-400 to-blue-400 rounded-full" />
                      <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wide whitespace-nowrap">
                        {group.layoutName}
                      </h2>
                      <div className="h-1 flex-1 bg-linear-to-l from-transparent via-blue-400 to-blue-400 rounded-full" />
                    </div>

                    {/* 🔹 Grid de cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 max-w-[1300px] mx-auto">
                      {group.entries.map((entry, i) => {
                        const image = getMainImage(entry);
                        const itemName =
                          entry.brItems?.[0]?.name ??
                          entry.tracks?.[0]?.title ??
                          entry.cars?.[0]?.name ??
                          entry.instruments?.[0]?.name ??
                          entry.FortniteLegoKit?.[0]?.name ??
                          entry.devName;

                        return (
                          <Card
                            key={i}
                            className={`group relative overflow-hidden border-2 border-blue-500/30 bg-linear-to-br from-blue-500 to-blue-600 hover:border-blue-400 hover:shadow-xl hover:shadow-white/5 hover:scale-105 transition-all duration-300 cursor-pointer max-w-[250px] mx-auto  ${
                              entry.tracks ? "w-60 h-60" : "w-full"
                            }`}
                            style={{ animationDelay: `${i * 30}ms` }}
                          >
                            <Link
                              href={`/shop/item/${encodeURIComponent(
                                entry.offerId
                              )}`}
                              className="block aspect-square"
                            >
                              <Image
                                src={image}
                                alt={itemName}
                                fill
                                loading="lazy"
                                className="object-cover object-center"
                              />

                              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

                              {entry.inDate &&
                                new Date(entry.inDate).getTime() >
                                  Date.now() - 15 * 24 * 60 * 60 * 1000 && (
                                  <span
                                    className={`absolute ${
                                      entry.tracks ? "top-2" : "top-10"
                                    } left-3 inline-block mb-2 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white rounded-full bg-red-600! shadow-lg`}
                                  >
                                    Novo!
                                  </span>
                                )}
                              <div className="absolute inset-x-0 bottom-0 h-2/5 flex items-end justify-center pb-4 px-3">
                                <p className="font-bold text-sm sm:text-base text-white text-center drop-shadow-[0_2px_10px_rgba(0,0,0,1)] leading-tight line-clamp-2">
                                  {itemName}
                                </p>
                              </div>

                              {/* 🔹 Preço */}
                              {listOffersIds?.includes(entry.offerId) ? (
                                <span className="absolute top-4 right-4 bg-green-600 text-white text-sm px-2 py-1 rounded-md">
                                  Adquirido!
                                </span>
                              ) : (
                                <div className="absolute top-2 right-4 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg text-white font-bold text-sm shadow-lg z-10">
                                  {entry.regularPrice &&
                                  entry.regularPrice !== entry.finalPrice ? (
                                    <>
                                      <span className="text-gray-400 line-through text-sm">
                                        {entry.regularPrice.toLocaleString()}
                                      </span>
                                      <span className="text-lg font-extrabold text-white">
                                        {entry.finalPrice.toLocaleString()}
                                      </span>
                                    </>
                                  ) : (
                                    <span>
                                      {entry.finalPrice.toLocaleString()}
                                    </span>
                                  )}
                                  <Image
                                    src="https://fortnite-api.com/images/vbuck.png"
                                    alt="V-Bucks"
                                    width={16}
                                    height={16}
                                    className="inline-block"
                                  />
                                </div>
                              )}

                              {/* 🔹 Raridade */}
                              {entry.brItems?.[0]?.rarity?.value && (
                                <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-yellow-400 border border-yellow-500/50 shadow-lg">
                                  {entry.brItems[0].rarity.value}
                                </div>
                              )}
                            </Link>
                          </Card>
                        );
                      })}
                    </div>
                  </section>
                ))}

              {/* Mensagem quando não há itens */}
              {filteredData.bundles.length === 0 &&
                filteredData.items.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-64 space-y-3">
                    <div className="text-6xl">🔍</div>
                    <p className="text-center text-slate-400 text-lg font-medium">
                      Nenhum item disponível na loja no momento
                    </p>
                  </div>
                )}
            </CardContent>
          </Card>
        </ScrollArea>
      </div>
    </div>
  );
}
