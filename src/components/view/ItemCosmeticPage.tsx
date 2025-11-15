"use client";

import Image from "next/image";
import { FortniteSingleItem } from "@/src/types/cosmeticsType";
import { Tooltip } from "@radix-ui/react-tooltip";
import { TooltipContent, TooltipTrigger } from "../ui-cn/tooltip";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function PageItemCosmetics({
  item,
  itemShop,
}: {
  item: FortniteSingleItem;
  itemShop: boolean;
}) {
  const router = useRouter();

  // Determinar a imagem principal
  const mainImage =
    item.images?.icon ||
    item.images?.featured ||
    item.images?.smallIcon ||
    "/placeholder.png";

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Fundo do item */}
      <div className="absolute inset-0">
        <Image
          src={mainImage}
          alt={item.name}
          fill
          priority
          className="object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/70 to-black/90 backdrop-blur-sm" />
      </div>

      {/* Conteúdo sobre o fundo */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center min-h-screen px-4 py-12">
        <button
          onClick={() => router.back()}
          className="flex absolute top-8 left-8 items-center gap-2 px-3 py-2 rounded-xl bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold transition-all cursor-pointer shadow-2xl border-2 border-blue-400/50 hover:border-blue-300 hover:scale-105"
        >
          <ArrowLeft size={22} />
          Voltar
        </button>

        {/* Nome do Item */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-transparent bg-linear-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text mb-4 drop-shadow-2xl tracking-tight">
          {item.name}
        </h1>

        {/* Descrição */}
        {item.description && (
          <p className="text-slate-300 text-lg sm:text-xl max-w-2xl mb-8 drop-shadow-lg">
            {item.description}
          </p>
        )}

        {/* Badges de Informação */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {/* Tipo */}
          {item.type?.value && (
            <span className="bg-linear-to-r from-blue-500 to-blue-600 text-white px-4 py-2 text-sm font-bold rounded-lg uppercase shadow-xl border-2 border-blue-400/50 tracking-wider">
              {item.type.value}
            </span>
          )}

          {/* Raridade */}
          {item.rarity?.value && (
            <span className="bg-linear-to-r from-purple-500 to-purple-600 text-white px-4 py-2 text-sm font-bold rounded-lg uppercase shadow-xl border-2 border-purple-400/50 tracking-wider">
              {item.rarity.value}
            </span>
          )}

          {/* Série */}
          {item.series?.value && (
            <span className="bg-linear-to-r from-yellow-500 to-yellow-600 text-black px-4 py-2 text-sm font-bold rounded-lg uppercase shadow-xl border-2 border-yellow-400/50 tracking-wider">
              {item.series.value}
            </span>
          )}

          {/* Set */}
          {item.set?.value && (
            <span className="bg-linear-to-r from-green-500 to-green-600 text-white px-4 py-2 text-sm font-bold rounded-lg uppercase shadow-xl border-2 border-green-400/50 tracking-wider">
              {item.set.value}
            </span>
          )}
        </div>

        {/* Imagem Principal */}
        <div className="flex flex-col items-center justify-center max-w-6xl mb-8">
          <div className="relative group w-80 h-80 sm:w-96 sm:h-96 rounded-3xl overflow-hidden border-2 border-blue-500/30 hover:border-blue-400/60 shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 bg-linear-to-br from-slate-800 to-slate-900">
            <Image
              src={mainImage}
              alt={item.name}
              fill
              priority
              className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="flex flex-wrap justify-center items-center gap-6 max-w-4xl text-slate-300">
          {/* Introdução */}
          {item.introduction && (
            <div className="bg-slate-800/50 backdrop-blur-md px-6 py-4 rounded-xl border border-slate-700/50">
              <p className="text-sm uppercase tracking-wide text-slate-400 mb-1">
                Introduzido em
              </p>
              <p className="font-bold text-white">
                {item.introduction.chapter && item.introduction.season
                  ? `Capítulo ${item.introduction.chapter}, Temporada ${item.introduction.season}`
                  : item.introduction.text || "N/A"}
              </p>
            </div>
          )}

          {/* Data de Adição */}
          {item.added && (
            <div className="bg-slate-800/50 backdrop-blur-md px-6 py-4 rounded-xl border border-slate-700/50">
              <p className="text-sm uppercase tracking-wide text-slate-400 mb-1">
                Adicionado em
              </p>
              <p className="font-bold text-white">
                {new Date(item.added).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          )}

          {itemShop && (
            <div className="bg-slate-800/50 backdrop-blur-md h-max px-6 py-4 rounded-xl border border-slate-700/50">
              <p className="font-bold text-white ">A Venda na Loja Agora!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
