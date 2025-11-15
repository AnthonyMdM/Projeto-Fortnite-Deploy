"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import { FortniteItems, FortniteSingleItem } from "../../types/cosmeticsType";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui-cn/card";
import { Input } from "@/src/components/ui-cn/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui-cn/select";
import { ScrollArea } from "@/src/components/ui-cn/scroll-area";
import { Label } from "@/src/components/ui-cn/label";
import { Checkbox } from "@/src/components/ui-cn/checkbox";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/src/components/ui-cn/pagination";
import Link from "next/link";
import { FunnelPlus, FunnelX } from "lucide-react";
import { Tooltip } from "@radix-ui/react-tooltip";
import { TooltipContent, TooltipTrigger } from "../ui-cn/tooltip";

// Função auxiliar para normalizar itens de diferentes categorias
function normalizeItem(item: any, category: string): FortniteSingleItem {
  // Para itens BR (já estão no formato correto)
  if (category === "br") {
    return item as FortniteSingleItem;
  }

  // Para tracks (músicas)
  if (category === "tracks") {
    return {
      id: item.id,
      name: item.title || item.name,
      description: `${item.artist} - ${item.releaseYear}`,
      type: { value: "Track", displayValue: "Track", backendValue: "track" },
      rarity: {
        value: "Uncommon",
        displayValue: "Uncommon",
        backendValue: "uncommon",
      },
      images: { icon: item.albumArt, smallIcon: item.albumArt },
      added: item.added,
    };
  }

  // Para instruments
  if (category === "instruments") {
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      type: item.type,
      rarity: item.rarity,
      images: { icon: item.images.large, smallIcon: item.images.small },
      added: item.added,
    };
  }

  // Para cars
  if (category === "cars") {
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      type: item.type,
      rarity: item.rarity,
      images: { icon: item.images.large, smallIcon: item.images.small },
      added: item.added,
    };
  }

  // Para lego
  if (category === "lego") {
    return {
      id: item.id,
      name: item.cosmeticId || item.id,
      type: { value: "LEGO", displayValue: "LEGO", backendValue: "lego" },
      images: { icon: item.images.large, smallIcon: item.images.small },
      added: item.added,
    };
  }

  // Para legoKits
  if (category === "legoKits") {
    return {
      id: item.id,
      name: item.name,
      type: item.type,
      series: item.series,
      images: {
        icon: item.images.wide || item.images.small,
        smallIcon: item.images.small,
      },
      added: item.added,
    };
  }

  // Para beans
  if (category === "beans") {
    return {
      id: item.id,
      name: item.name,
      description: `Gender: ${item.gender}`,
      type: { value: "Bean", displayValue: "Bean", backendValue: "bean" },
      images: { icon: item.images.large, smallIcon: item.images.small },
      added: item.added,
    };
  }

  return item;
}

export default function PageCosmeticsNew({
  initialData,
  listShop,
  itensComprados,
}: {
  initialData: FortniteItems;
  listShop: string[];
  itensComprados?: string[];
}) {
  // 🔍 Filtros
  const [query, setQuery] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("todas");
  const [tipoSelecionado, setTipoSelecionado] = useState("todos");
  const [raridadeSelecionada, setRaridadeSelecionada] = useState("todas");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [apenasNovos, setApenasNovos] = useState(false);
  const [filtroTodos, setFiltroTodos] = useState(false);

  // 📄 Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itensPorPagina = 30;

  const [dataAtual] = useState(() => Date.now());

  // 🔄 Combinar todos os itens em uma lista única
  const todosItens = useMemo(() => {
    const items: Array<FortniteSingleItem & { category: string }> = [];

    if (initialData.br) {
      initialData.br.forEach((item) => {
        items.push({ ...normalizeItem(item, "br"), category: "br" });
      });
    }
    if (initialData.tracks) {
      initialData.tracks.forEach((item) => {
        items.push({ ...normalizeItem(item, "tracks"), category: "tracks" });
      });
    }
    if (initialData.instruments) {
      initialData.instruments.forEach((item) => {
        items.push({
          ...normalizeItem(item, "instruments"),
          category: "instruments",
        });
      });
    }
    if (initialData.cars) {
      initialData.cars.forEach((item) => {
        items.push({ ...normalizeItem(item, "cars"), category: "cars" });
      });
    }
    if (initialData.lego) {
      initialData.lego.forEach((item) => {
        items.push({ ...normalizeItem(item, "lego"), category: "lego" });
      });
    }
    if (initialData.legoKits) {
      initialData.legoKits.forEach((item) => {
        items.push({
          ...normalizeItem(item, "legoKits"),
          category: "legoKits",
        });
      });
    }
    if (initialData.beans) {
      initialData.beans.forEach((item) => {
        items.push({ ...normalizeItem(item, "beans"), category: "beans" });
      });
    }

    return items;
  }, [initialData]);

  // 🔎 Filtro por nome e categoria
  const itensFiltradosPorNomeECategoria = useMemo(() => {
    let filtered = todosItens;

    // Filtrar por categoria
    if (categoriaSelecionada !== "todas") {
      filtered = filtered.filter(
        (item) => item.category === categoriaSelecionada
      );
    }

    // Filtrar por nome
    if (query.trim()) {
      filtered = filtered.filter((item) =>
        item.name?.toLowerCase().includes(query.toLowerCase())
      );
    }

    return filtered;
  }, [query, categoriaSelecionada, todosItens]);

  // 🔎 Filtros disponíveis
  const tiposDisponiveis = useMemo(() => {
    const tipos = itensFiltradosPorNomeECategoria
      .map((item) => item.type?.value)
      .filter((t): t is string => typeof t === "string" && t.length > 0); // ← Type guard
    return Array.from(new Set(tipos)).sort((a, b) =>
      a.localeCompare(b, "pt", { sensitivity: "base" })
    );
  }, [itensFiltradosPorNomeECategoria]);

  const raridadesDisponiveis = useMemo(() => {
    const raridades = itensFiltradosPorNomeECategoria
      .map((item) => item.rarity?.value)
      .filter((r): r is string => typeof r === "string" && r.length > 0); // ← Type guard
    return Array.from(new Set(raridades)).sort((a, b) =>
      a.localeCompare(b, "pt", { sensitivity: "base" })
    );
  }, [itensFiltradosPorNomeECategoria]);

  // Resultados filtrados (SEM limite)
  const resultadosFiltrados = useMemo(() => {
    return itensFiltradosPorNomeECategoria.filter((item) => {
      if (tipoSelecionado !== "todos" && item.type?.value !== tipoSelecionado)
        return false;
      if (
        raridadeSelecionada !== "todas" &&
        item.rarity?.value !== raridadeSelecionada
      )
        return false;

      if (dataInicio || dataFim) {
        const dataItem = item.added ? new Date(item.added) : null;
        if (!dataItem) return false;

        const inicio = dataInicio ? new Date(dataInicio + "T00:00:00") : null;
        const fim = dataFim ? new Date(dataFim + "T23:59:59") : null;
        if (inicio && dataItem < inicio) return false;
        if (fim && dataItem > fim) return false;
      }

      if (apenasNovos && item.added) {
        const addedDate = new Date(item.added);
        const diffDias =
          (dataAtual - addedDate.getTime()) / (1000 * 60 * 60 * 24);
        if (diffDias > 15) return false;
      }

      return true;
    });
  }, [
    itensFiltradosPorNomeECategoria,
    tipoSelecionado,
    raridadeSelecionada,
    dataInicio,
    dataFim,
    apenasNovos,
    dataAtual,
  ]);

  // ⭐ Paginação aplicada
  const totalPaginas = Math.ceil(resultadosFiltrados.length / itensPorPagina);
  const resultadosPaginados = useMemo(() => {
    const inicio = (paginaAtual - 1) * itensPorPagina;
    return resultadosFiltrados.slice(inicio, inicio + itensPorPagina);
  }, [resultadosFiltrados, paginaAtual, itensPorPagina]);

  // Reset página ao filtrar
  React.useEffect(() => {
    setPaginaAtual(1);
  }, [
    query,
    categoriaSelecionada,
    tipoSelecionado,
    raridadeSelecionada,
    dataInicio,
    dataFim,
    apenasNovos,
  ]);

  // Função para mudar de página com loading
  const mudarPagina = (novaPagina: number) => {
    setIsLoading(true);
    setPaginaAtual(novaPagina);

    setTimeout(() => {
      setIsLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 300);
  };

  // Função para gerar os números das páginas visíveis
  const gerarPaginasVisiveis = () => {
    const paginas: (number | string)[] = [];
    const maxPaginasVisiveis = 5;

    if (totalPaginas <= maxPaginasVisiveis) {
      for (let i = 1; i <= totalPaginas; i++) {
        paginas.push(i);
      }
    } else {
      if (paginaAtual <= 3) {
        for (let i = 1; i <= 4; i++) paginas.push(i);
        paginas.push("ellipsis");
        paginas.push(totalPaginas);
      } else if (paginaAtual >= totalPaginas - 2) {
        paginas.push(1);
        paginas.push("ellipsis");
        for (let i = totalPaginas - 3; i <= totalPaginas; i++) paginas.push(i);
      } else {
        paginas.push(1);
        paginas.push("ellipsis");
        for (let i = paginaAtual - 1; i <= paginaAtual + 1; i++)
          paginas.push(i);
        paginas.push("ellipsis");
        paginas.push(totalPaginas);
      }
    }

    return paginas;
  };

  // Mapear categorias para nomes amigáveis
  const categoriaLabels: Record<string, string> = {
    todas: "Todas Categorias",
    br: "Battle Royale",
    tracks: "Músicas",
    instruments: "Instrumentos",
    cars: "Veículos",
    lego: "LEGO",
    legoKits: "LEGO Kits",
    beans: "Beans",
  };

  return (
    <div className="min-h-screen flex justify-center items-start bg-background py-2">
      <ScrollArea>
        <Card className="w-full min-w-none xl:min-w-[1400px] mx-auto border-0 shadow-md ">
          <CardHeader>
            <CardTitle className="font-bold text-5xl md:text-7xl shadow-lg text-black font-roboto uppercase bg-yellow-400 px-8 py-4 w-max rounded-2xl">
              Busca de Itens
            </CardTitle>
          </CardHeader>
          <CardContent className="flex px-0 flex-col space-y-6 w-full">
            {/* 🔍 Filtros */}
            <div className="space-y-4 px-4 md:px-8 lg:px-12">
              <div className="flex flex-col sm:flex-row md:items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Input
                      className="flex-2 border-white border-2 focus:border-0"
                      placeholder="Buscar item..."
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                      }}
                    />
                  </TooltipTrigger>
                  <TooltipContent
                    sideOffset={10}
                    className="bg-black/80 text-white border border-white/20 backdrop-blur-md"
                  >
                    <p>Buscar Itens pelo nome</p>
                  </TooltipContent>
                </Tooltip>

                {/* Filtro de Categoria - sempre visível */}
                <Select
                  value={categoriaSelecionada}
                  onValueChange={(v) => setCategoriaSelecionada(v)}
                  defaultValue="todas"
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SelectTrigger className="cursor-pointer border-2 border-white min-w-[180px]">
                        <SelectValue placeholder="Categoria" />
                      </SelectTrigger>
                    </TooltipTrigger>
                    <TooltipContent
                      sideOffset={10}
                      className="bg-black/80 text-white border border-white/20 backdrop-blur-md"
                    >
                      <p>Filtrar por categoria</p>
                    </TooltipContent>
                  </Tooltip>
                  <SelectContent className="bg-blue-800 border border-white">
                    {Object.entries(categoriaLabels).map(([key, label]) => (
                      <SelectItem
                        key={key}
                        value={key}
                        className="cursor-pointer border-t border-white rounded-none hover:bg-white/5"
                      >
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {!filtroTodos && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <FunnelPlus
                        className="hover:text-black text-white cursor-pointer"
                        onClick={() => setFiltroTodos(!filtroTodos)}
                      />
                    </TooltipTrigger>
                    <TooltipContent
                      sideOffset={10}
                      className="bg-black/80 text-white border border-white/20 backdrop-blur-md"
                    >
                      <p>Mostrar filtros</p>
                    </TooltipContent>
                  </Tooltip>
                )}

                {filtroTodos && (
                  <>
                    <Select
                      value={tipoSelecionado}
                      onValueChange={(v) => setTipoSelecionado(v)}
                      defaultValue="todos"
                    >
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SelectTrigger className="cursor-pointer border-2 border-white">
                            <SelectValue placeholder="Filtrar por tipo" />
                          </SelectTrigger>
                        </TooltipTrigger>
                        <TooltipContent
                          sideOffset={10}
                          className="bg-black/80 text-white border border-white/20 backdrop-blur-md"
                        >
                          <p>Mostrar filtros: Tipos</p>
                        </TooltipContent>
                      </Tooltip>
                      <SelectContent className="bg-blue-800 border border-white">
                        <SelectItem value="todos">Todos Tipos</SelectItem>
                        {tiposDisponiveis.map((r, i) => (
                          <SelectItem
                            key={i}
                            value={r}
                            className="cursor-pointer border-t border-white rounded-none hover:bg-white/5"
                          >
                            {r}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={raridadeSelecionada}
                      onValueChange={(v) => setRaridadeSelecionada(v)}
                      defaultValue="todas"
                    >
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SelectTrigger className="cursor-pointer  border-2 border-white">
                            <SelectValue placeholder="Filtrar por raridade" />
                          </SelectTrigger>
                        </TooltipTrigger>
                        <TooltipContent
                          sideOffset={10}
                          className="bg-black/80 text-white border border-white/20 backdrop-blur-md"
                        >
                          <p>Mostrar filtros: Raridade</p>
                        </TooltipContent>
                      </Tooltip>
                      <SelectContent className="bg-blue-800 border border-white">
                        <SelectItem value="todas">
                          Todas as raridades
                        </SelectItem>
                        {raridadesDisponiveis.map((r, i) => (
                          <SelectItem
                            key={i}
                            value={r} // ← Remover a verificação !r ? "todas" : r
                            className="cursor-pointer border-t border-white rounded-none hover:bg-white/5"
                          >
                            {r}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </>
                )}
              </div>
              {filtroTodos && (
                <div className="flex flex-col md:flex-row md:items-center mb-0 gap-2">
                  <div className="flex flex-col md:flex-row *:w-max gap-3">
                    <div className="flex flex-col space-y-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Label className="cursor-help text-white">
                            Data inicial
                          </Label>
                        </TooltipTrigger>
                        <TooltipContent
                          sideOffset={6}
                          className="bg-black/80 text-white border border-white/20 backdrop-blur-md px-2 py-1 rounded-md text-xs"
                        >
                          <p>Selecione a data de início do filtro</p>
                        </TooltipContent>
                      </Tooltip>

                      <Input
                        className="cursor-pointer border-2 border-white focus:outline-none focus-visible:ring-0 focus-visible:border-white bg-transparent text-white"
                        type="date"
                        value={dataInicio}
                        onChange={(e) => setDataInicio(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-col space-y-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Label className="cursor-help text-white">
                            Data final
                          </Label>
                        </TooltipTrigger>
                        <TooltipContent
                          sideOffset={6}
                          className="bg-black/80 text-white border border-white/20 backdrop-blur-md px-2 py-1 rounded-md text-xs"
                        >
                          <p>Selecione a data final do filtro</p>
                        </TooltipContent>
                      </Tooltip>

                      <Input
                        className="cursor-pointer border-white border-2 focus:border-0"
                        type="date"
                        value={dataFim}
                        onChange={(e) => setDataFim(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-end gap-2 mt-2">
                      <Checkbox
                        className="border border-white data-[state=checked]:bg-white data-[state=checked]:text-blue-900"
                        checked={apenasNovos}
                        onCheckedChange={(v) => setApenasNovos(!!v)}
                      />
                      <Label className="text-white">
                        Apenas novos (últimos 15 dias)
                      </Label>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <FunnelX
                            className="hover:text-black text-white cursor-pointer"
                            onClick={() => setFiltroTodos(!filtroTodos)}
                          />
                        </TooltipTrigger>
                        <TooltipContent
                          sideOffset={10}
                          className="bg-black/80 text-white border border-white/20 backdrop-blur-md"
                        >
                          <p>Minimizar filtros</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              )}

              {/* ℹ️ Info de resultados */}
              <div className="text-sm font-roboto text-muted-foreground text-right mt-2">
                {resultadosFiltrados.length} itens encontrados
                {totalPaginas > 1 &&
                  ` • Página ${paginaAtual} de ${totalPaginas}`}
              </div>
            </div>

            {/* 📜 Resultados */}
            <div className="overflow-hidden w-full relative min-h-[500px]">
              {isLoading && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-lg font-semibold text-blue-500">
                      Carregando...
                    </p>
                  </div>
                </div>
              )}

              {resultadosPaginados.length > 0 ? (
                <>
                  {/* Grid com tamanho máximo controlado */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 px-4 max-w-[1300px] mx-auto mt-2 ">
                    {resultadosPaginados.map((item, i) => (
                      <Card
                        key={i}
                        className={`group relative overflow-hidden py-0 hover:border-2 border-blue-500/30 bg-linear-to-br from-blue-500 to-blue-600 hover:border-blue-400 hover:shadow-xl hover:shadow-white/5 hover:scale-105 transition-all duration-300 cursor-pointer max-w-[250px] mx-auto w-full ${
                          isLoading
                            ? "opacity-50 pointer-events-none"
                            : "animate-in fade-in duration-300"
                        }`}
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
                              item.images?.featured ||
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
                          {itensComprados &&
                          itensComprados.includes(item.id) ? (
                            // Usuário logado e já adquiriu o item
                            <div className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-sm border border-yellow-500/50 text-xs font-bold text-yellow-400 shadow-lg">
                              Adquirido ✅
                            </div>
                          ) : listShop?.includes(item.id) ? (
                            // Usuário não logado OU logado mas sem o item
                            <div className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-sm border border-yellow-500/50 text-xs font-bold text-yellow-400 shadow-lg">
                              Disponível na Loja
                            </div>
                          ) : null}
                        </Link>
                      </Card>
                    ))}
                  </div>
                  {/* 🔢 Paginação do Shadcn UI */}
                  {totalPaginas > 1 && (
                    <div className="mt-8 pb-6">
                      <Pagination className="bg-blue-950/50 w-max rounded-md mx-auto">
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() =>
                                mudarPagina(Math.max(1, paginaAtual - 1))
                              }
                              className={
                                paginaAtual === 1 || isLoading
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
                                  isActive={paginaAtual === pagina}
                                  className={`cursor-pointer border rounded-md text-white transition-all 
      ${isLoading ? "pointer-events-none opacity-50" : ""}
      ${
        paginaAtual === pagina
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
                                  Math.min(totalPaginas, paginaAtual + 1)
                                )
                              }
                              className={
                                paginaAtual === totalPaginas || isLoading
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
                    Nenhum resultado encontrado
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
