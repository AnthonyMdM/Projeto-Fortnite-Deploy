"use client";

import Image from "next/image";
import {
  FortniteBr,
  FortniteCar,
  FortniteInstrument,
  FortniteLegoKit,
  FortniteTrack,
  ShopEntryItem,
} from "@/src/types/APIType";
import { Tooltip } from "@radix-ui/react-tooltip";
import { TooltipContent, TooltipTrigger } from "@/src/components/ui-cn/tooltip";
import { HoldButton } from "@/src/components/ui/pressButton";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createOfferBuy } from "@/src/actions/actionsDB";
import { User } from "@prisma/client";

export default function PageItem({
  item,
  listIds,
  user,
}: {
  item: ShopEntryItem;
  listIds?: string[];
  user?: User;
}) {
  const router = useRouter();
  const isBundle = Boolean(item.bundle);

  const handleConfirm = async () => {
    try {
      const result = await createOfferBuy(item);

      if (result.success) {
        alert("Compra realizada com sucesso!");
        router.push("/shop");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao realizar compra");
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 ">
      {isBundle ? (
        <>
          <div className="absolute inset-0">
            <Image
              src={item.bundle?.image ?? "/placeholder.png"}
              alt={item.bundle?.name ?? "Bundle"}
              fill
              priority
              className="object-cover object-top opacity-40"
            />
            <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/70 to-black/90 backdrop-blur-sm" />
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center text-center min-h-screen px-3 sm:px-4 py-8 sm:py-12">
            <button
              onClick={() => router.back()}
              className="flex absolute top-4 left-4 sm:top-8 sm:left-8 items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold transition-all cursor-pointer shadow-2xl border-2 border-blue-400/50 hover:border-blue-300 hover:scale-95"
            >
              <ArrowLeft size={18} className="sm:w-[22px] sm:h-[22px]" />
              <span className="text-sm sm:text-base">Voltar</span>
            </button>

            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-linear-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text mb-4 sm:mb-8 drop-shadow-2xl tracking-tight px-4">
              {item.bundle?.name || item.devName}
            </h1>

            {user && (
              <div className="mb-4 sm:mb-6">
                <span className="text-xs uppercase tracking-wide text-white/80">
                  Meus V-Bucks
                </span>
                <div className="flex flex-col items-center bg-black px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-white shadow-2xl border-2 border-blue-400/30">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="text-base sm:text-lg font-extrabold">
                      {user?.vbucks}
                    </span>
                    <Image
                      src="https://fortnite-api.com/images/vbuck.png"
                      alt="V-Bucks"
                      width={20}
                      height={20}
                      className="w-5 h-5 sm:w-7 sm:h-7 drop-shadow-md"
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-6 max-w-6xl mb-6 sm:mb-10">
              {item.brItems?.map((brItem: FortniteBr, j: number) => (
                <div
                  key={`br-${j}`}
                  className="group relative w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-xl sm:rounded-2xl overflow-hidden border-2 border-blue-500/30 hover:border-yellow-400/60 hover:scale-110 transition-all duration-300 bg-linear-to-br from-slate-800 to-slate-900 shadow-xl hover:shadow-2xl hover:shadow-yellow-500/20"
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="relative w-full h-full">
                        <Image
                          src={
                            brItem.images.icon ??
                            brItem.images.smallIcon ??
                            "/placeholder.png"
                          }
                          alt={brItem.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-slate-900/95 text-white text-sm sm:text-base border-2 border-yellow-400/50 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-xl">
                      <p className="font-bold">{brItem.name}</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 w-5 h-5 sm:w-6 sm:h-6 bg-linear-to-br from-blue-500 to-blue-600 rounded-full cursor-help shadow-lg border-2 border-blue-400/50" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-slate-900/95 text-white border-2 border-blue-400/50 backdrop-blur-md px-3 py-2 rounded-lg shadow-xl">
                      <p className="font-semibold text-xs sm:text-sm">
                        {brItem.type.value.toUpperCase()}
                      </p>
                    </TooltipContent>
                  </Tooltip>

                  {listIds?.includes(brItem.id) && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 w-5 h-5 sm:w-6 sm:h-6 bg-linear-to-br from-green-500 to-green-600 rounded-full cursor-help shadow-lg border-2 border-green-400/50" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-slate-900/95 text-white border-2 border-green-400/50 backdrop-blur-md px-3 py-2 rounded-lg shadow-xl">
                        <p className="font-semibold text-xs sm:text-sm">
                          Adquirido!
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              ))}

              {item.tracks?.map((track: FortniteTrack, j: number) => (
                <div
                  key={`track-${j}`}
                  className="group relative w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-xl sm:rounded-2xl overflow-hidden border-2 border-blue-500/30 hover:border-yellow-400/60 hover:scale-110 transition-all duration-300 bg-linear-to-br from-slate-800 to-slate-900 shadow-xl hover:shadow-2xl hover:shadow-yellow-500/20"
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="relative w-full h-full">
                        <Image
                          src={track.albumArt ?? "/placeholder.png"}
                          alt={track.title ?? "Música"}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-slate-900/95 text-white text-sm sm:text-base border-2 border-yellow-400/50 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-xl">
                      <p className="font-bold">{track.title}</p>
                    </TooltipContent>
                  </Tooltip>
                  {listIds?.includes(track.id) && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 w-5 h-5 sm:w-6 sm:h-6 bg-linear-to-br from-green-500 to-green-600 rounded-full cursor-help shadow-lg border-2 border-green-400/50" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-slate-900/95 text-white border-2 border-green-400/50 backdrop-blur-md px-3 py-2 rounded-lg shadow-xl">
                        <p className="font-semibold text-xs sm:text-sm">
                          Adquirido!
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              ))}

              {item.cars?.map((car: FortniteCar, j: number) => (
                <div
                  key={`car-${j}`}
                  className="group relative w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-xl sm:rounded-2xl overflow-hidden border-2 border-blue-500/30 hover:border-yellow-400/60 hover:scale-110 transition-all duration-300 bg-linear-to-br from-slate-800 to-slate-900 shadow-xl hover:shadow-2xl hover:shadow-yellow-500/20"
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="relative w-full h-full">
                        <Image
                          src={car.images.small ?? "/placeholder.png"}
                          alt={car.name ?? "Carro"}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-slate-900/95 text-white text-sm sm:text-base border-2 border-yellow-400/50 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-xl">
                      <p className="font-bold">{car.name}</p>
                    </TooltipContent>
                  </Tooltip>
                  {listIds?.includes(car.id) && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 w-5 h-5 sm:w-6 sm:h-6 bg-linear-to-br from-green-500 to-green-600 rounded-full cursor-help shadow-lg border-2 border-green-400/50" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-slate-900/95 text-white border-2 border-green-400/50 backdrop-blur-md px-3 py-2 rounded-lg shadow-xl">
                        <p className="font-semibold text-xs sm:text-sm">
                          Adquirido!
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              ))}

              {item.instruments?.map(
                (instrument: FortniteInstrument, j: number) => (
                  <div
                    key={`instrument-${j}`}
                    className="group relative w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-xl sm:rounded-2xl overflow-hidden border-2 border-blue-500/30 hover:border-yellow-400/60 hover:scale-110 transition-all duration-300 bg-linear-to-br from-slate-800 to-slate-900 shadow-xl hover:shadow-2xl hover:shadow-yellow-500/20"
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="relative w-full h-full">
                          <Image
                            src={instrument.images.small ?? "/placeholder.png"}
                            alt={instrument.name ?? "Instrumento"}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-slate-900/95 text-white text-sm sm:text-base border-2 border-yellow-400/50 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-xl">
                        <p className="font-bold">{instrument.name}</p>
                      </TooltipContent>
                    </Tooltip>
                    {listIds?.includes(instrument.id) && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 w-5 h-5 sm:w-6 sm:h-6 bg-linear-to-br from-green-500 to-green-600 rounded-full cursor-help shadow-lg border-2 border-green-400/50" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-slate-900/95 text-white border-2 border-green-400/50 backdrop-blur-md px-3 py-2 rounded-lg shadow-xl">
                          <p className="font-semibold text-xs sm:text-sm">
                            Adquirido!
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                )
              )}

              {item.legoKits?.map((legoKit: FortniteLegoKit, j: number) => (
                <div
                  key={`legoKits-${j}`}
                  className="group relative w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-xl sm:rounded-2xl overflow-hidden border-2 border-blue-500/30 hover:border-yellow-400/60 hover:scale-110 transition-all duration-300 bg-linear-to-br from-slate-800 to-slate-900 shadow-xl hover:shadow-2xl hover:shadow-yellow-500/20"
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="relative w-full h-full">
                        <Image
                          src={legoKit.images.small ?? "/placeholder.png"}
                          alt={legoKit.name ?? "LEGO Kit"}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-slate-900/95 text-white text-sm sm:text-base border-2 border-yellow-400/50 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-xl">
                      <p className="font-bold">{legoKit.name}</p>
                    </TooltipContent>
                  </Tooltip>
                  {listIds?.includes(legoKit.id) && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 w-5 h-5 sm:w-6 sm:h-6 bg-linear-to-br from-green-500 to-green-600 rounded-full cursor-help shadow-lg border-2 border-green-400/50" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-slate-900/95 text-white border-2 border-green-400/50 backdrop-blur-md px-3 py-2 rounded-lg shadow-xl">
                        <p className="font-semibold text-xs sm:text-sm">
                          Adquirido!
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center">
              <div className="flex items-center gap-2 sm:gap-3 bg-linear-to-r from-blue-500 to-blue-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-white font-black text-lg sm:text-xl shadow-2xl border-2 border-blue-400/50">
                {listIds?.includes(item.offerId) ? (
                  <div className="bg-green-500 text-white text-center px-3 py-1 rounded-xl font-semibold text-sm sm:text-base">
                    Adquirido!
                  </div>
                ) : (
                  <>
                    {item.regularPrice &&
                    item.regularPrice !== item.finalPrice ? (
                      <>
                        <span className="text-black/60 line-through text-sm sm:text-base">
                          {item.regularPrice.toLocaleString()}
                        </span>
                        <span className="text-xl sm:text-2xl">
                          {item.finalPrice.toLocaleString()}
                        </span>
                      </>
                    ) : (
                      <span className="text-xl sm:text-2xl">
                        {item.finalPrice.toLocaleString()}
                      </span>
                    )}
                  </>
                )}

                <Image
                  src="https://fortnite-api.com/images/vbuck.png"
                  alt="V-Bucks"
                  width={32}
                  height={32}
                  className="inline-block drop-shadow-lg w-6 h-6 sm:w-8 sm:h-8"
                />
              </div>

              {!listIds?.includes(item.offerId) && (
                <HoldButton
                  onConfirm={handleConfirm}
                  className="p-3 sm:p-5 text-base sm:text-xl font-poppins"
                >
                  Comprar
                </HoldButton>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="relative z-10 flex flex-col items-center justify-center text-center min-h-screen px-3 sm:px-4 py-8 sm:py-12">
            <button
              onClick={() => router.back()}
              className="flex absolute top-4 left-4 sm:top-8 sm:left-8 items-center gap-1 sm:gap-3 px-2 sm:px-5 py-1.5 sm:py-3 rounded-lg sm:rounded-xl bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold transition-all cursor-pointer shadow-2xl border-2 border-blue-400/50 hover:border-blue-300 hover:scale-95 sm:hover:scale-105"
            >
              <ArrowLeft size={18} className="sm:w-[22px] sm:h-[22px]" />
              <span className="hidden sm:inline">Voltar</span>
            </button>

            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-linear-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text mb-4 sm:mb-8 drop-shadow-2xl tracking-tight px-4">
              {item.brItems?.[0]?.name ||
                item.tracks?.[0]?.title ||
                item.cars?.[0]?.name ||
                item.instruments?.[0]?.name ||
                item.legoKits?.[0]?.name ||
                item.devName}
            </h1>

            <div className="flex flex-col md:flex-row items-center justify-center max-w-6xl gap-4 sm:gap-6 mb-20 sm:mb-8">
              {[
                ...(item.brItems ?? []),
                ...(item.tracks ?? []),
                ...(item.cars ?? []),
                ...(item.instruments ?? []),
                ...(item.legoKits ?? []),
              ].map((subItem: any, index: number) => (
                <div
                  key={subItem.id ?? index}
                  className="relative group w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-blue-500/30 hover:border-blue-400/60 shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 bg-linear-to-br from-slate-800 to-slate-900"
                >
                  <Image
                    src={
                      subItem.images?.icon ??
                      subItem.images?.smallIcon ??
                      subItem.albumArt ??
                      subItem.images?.small ??
                      "/placeholder.png"
                    }
                    alt={subItem.name ?? subItem.title ?? "Item"}
                    fill
                    priority
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 w-6 h-6 sm:w-8 sm:h-8 bg-linear-to-br from-blue-500 to-blue-600 rounded-full cursor-help shadow-lg border-2 border-blue-400/50" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-slate-900/95 text-white border-2 border-blue-400/50 backdrop-blur-md px-3 py-2 rounded-lg shadow-xl">
                      <p className="font-semibold text-xs sm:text-sm">
                        {subItem.name || subItem.title}
                      </p>
                    </TooltipContent>
                  </Tooltip>

                  {listIds?.includes(subItem.id) && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 w-6 h-6 sm:w-8 sm:h-8 bg-linear-to-br from-green-500 to-green-600 rounded-full cursor-help shadow-lg border-2 border-green-400/50" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-slate-900/95 text-white border-2 border-green-400/50 backdrop-blur-md px-3 py-2 rounded-lg shadow-xl">
                        <p className="font-semibold text-xs sm:text-sm">
                          Adquirido!
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              ))}
            </div>

            <div className="fixed bottom-4 right-4 sm:absolute sm:bottom-5 sm:right-10 flex flex-col sm:flex-row gap-2 sm:gap-6 items-end sm:items-center">
              <div className="flex items-center gap-1.5 sm:gap-3 bg-linear-to-r from-blue-500 to-blue-600 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-white font-black text-base sm:text-xl shadow-2xl border-2 border-blue-400/50">
                {listIds?.includes(item.offerId) ? (
                  <div className="bg-green-500 text-white text-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-base">
                    Adquirido!
                  </div>
                ) : item.regularPrice &&
                  item.regularPrice !== item.finalPrice ? (
                  <>
                    <span className="text-white/70 line-through text-xs sm:text-base">
                      {item.regularPrice.toLocaleString()}
                    </span>
                    <span className="text-lg sm:text-2xl">
                      {item.finalPrice.toLocaleString()}
                    </span>
                  </>
                ) : (
                  <span className="text-lg sm:text-2xl">
                    {item.finalPrice.toLocaleString()}
                  </span>
                )}
                <Image
                  src="https://fortnite-api.com/images/vbuck.png"
                  alt="V-Bucks"
                  width={32}
                  height={32}
                  className="inline-block drop-shadow-lg w-5 h-5 sm:w-8 sm:h-8"
                />
              </div>

              {!listIds?.includes(item.offerId) && (
                <HoldButton
                  onConfirm={handleConfirm}
                  className="p-3 sm:p-5 text-sm sm:text-xl font-poppins"
                >
                  Comprar
                </HoldButton>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
