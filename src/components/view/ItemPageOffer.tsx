"use client";

import Image from "next/image";
import { HoldButton } from "@/src/components/ui/pressButton";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { refundOffer } from "@/src/actions/actionsDB";
import { OfferBuy, User } from "@prisma/client";
import { FortniteSingleItem } from "@/src/types/cosmeticsType";

export default function PageItemOffer({
  item,
  offer,
  user,
}: {
  item: FortniteSingleItem[];
  offer: OfferBuy;
  user: User;
}) {
  const router = useRouter();

  const handleConfirm = async () => {
    const result = await refundOffer(offer.id);

    if (result.success) {
      alert("Reembolso realizado com sucesso!");
    } else {
      alert(result.error || "Erro ao reembolsar");
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col">
      {/* ================= HEADER ================= */}
      <header className="w-full px-6 py-6 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-linear-to-r from-blue-600 to-blue-700 
                     hover:from-blue-500 hover:to-blue-600 font-bold shadow-xl border-2 border-blue-400/50 
                     hover:border-blue-300 transition-all hover:scale-105"
        >
          <ArrowLeft size={22} />
          Voltar
        </button>

        {/* Nome do item */}
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-black text-transparent 
                       bg-linear-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text drop-shadow-2xl"
        >
          {item[0]?.name}
        </h1>

        {/* 🔹 V-Bucks atuais do usuário */}
        <div>
          <span className="text-xs uppercase tracking-wide text-white/80">
            Meus V-Bucks
          </span>
          <div
            className="flex flex-col items-end bg-black
             px-2 py-1 rounded-xl text-white shadow-2xl border-2 border-blue-400/30"
          >
            {/* Valor + Ícone */}
            <div className="flex items-center gap-1">
              <span className="text-lg font-extrabold">
                {user.vbucks.toLocaleString()}
              </span>
              <Image
                src="https://fortnite-api.com/images/vbuck.png"
                alt="V-Bucks"
                width={28}
                height={28}
                className="drop-shadow-md"
              />
            </div>
          </div>
        </div>
      </header>

      {/* ================= LISTA DE ITENS ================= */}
      <main className="flex-1 flex flex-wrap justify-center gap-8 px-6 py-10 max-w-6xl mx-auto">
        {item.map((subItem) => (
          <div
            key={subItem.id}
            className="relative group w-72 h-72 sm:w-80 sm:h-80 rounded-3xl overflow-hidden 
                       border-2 border-blue-500/30 hover:border-blue-400/60 
                       shadow-2xl hover:shadow-blue-500/20 transition-all 
                       duration-300 hover:scale-105 bg-linear-to-br from-slate-800 to-slate-900"
          >
            <Image
              src={
                subItem.images?.icon ??
                subItem.images?.smallIcon ??
                "/placeholder.png"
              }
              alt={subItem.name}
              fill
              priority
              className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        ))}
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="w-full px-10 py-8 flex justify-end items-center gap-6">
        <div
          className="flex items-center gap-3 bg-linear-to-r from-blue-500 to-blue-600 px-4 py-2 
                        rounded-xl text-white font-black text-2xl shadow-2xl border-2 border-blue-400/50"
        >
          {offer.price.toLocaleString()}
          <Image
            src="https://fortnite-api.com/images/vbuck.png"
            alt="V-Bucks"
            width={34}
            height={34}
            className="drop-shadow-lg"
          />
        </div>

        <HoldButton
          onConfirm={handleConfirm}
          className="p-5 text-xl font-poppins"
        >
          Reembolsar
        </HoldButton>
      </footer>
    </div>
  );
}
