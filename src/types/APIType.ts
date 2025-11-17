export interface FortniteType {
  value: string;
  displayValue: string;
  backendValue: string;
}

export interface FortniteRarity {
  value: string;
  displayValue: string;
  backendValue: string;
}

export interface FortniteSeries {
  value: string;
  image: string;
  colors?: string[];
  backendValue?: string;
}

export interface FortniteSet {
  value: string;
  text: string;
}

export interface FortniteImages {
  smallIcon?: string;
  icon?: string;
  featured?: string;
  other?: string | { background?: string };
  lego?: { small?: string; large?: string; wide?: string };
  bean?: { small?: string; large?: string };
  small?: string;
  large?: string;
  wide?: string;
}

export interface FortniteIntroduction {
  chapter?: string;
  season?: string;
  text?: string;
}

export interface FortniteBr {
  id: string;
  name: string;
  description?: string;
  type: FortniteType;
  rarity: FortniteRarity;
  series?: FortniteSeries | null;
  set?: FortniteSet | null;
  introduction?: FortniteIntroduction | null;
  images: FortniteImages;
  variants?: Array<{
    channel: string;
    type: string;
    options: Array<{
      tag: string;
      name: string;
      image: string;
    }>;
  }> | null;
  showcaseVideo?: string;
  added?: string;
}

export interface FortniteTrack {
  id: string;
  devName: string;
  title: string;
  artist: string;
  releaseYear: number;
  bpm: number;
  duration: number;
  difficulty: {
    vocals: number;
    guitar: number;
    bass: number;
    plasticBass: number;
    drums: number;
    plasticDrums: number;
  };
  albumArt: string;
  added: string;
}

export interface FortniteInstrument {
  id: string;
  name: string;
  description: string;
  type: FortniteType;
  rarity: FortniteRarity;
  images: { small: string; large: string };
  added: string;
}

export interface FortniteCar {
  id: string;
  vehicleId?: string;
  name: string;
  description?: string;
  type: FortniteType;
  rarity: FortniteRarity;
  images: { small: string; large: string };
  added: string;
}

export interface FortniteLego {
  id: string;
  cosmeticId: string;
  images: { small: string; large: string };
  added: string;
}

export interface FortniteLegoKit {
  id: string;
  name: string;
  type: FortniteType;
  series?: FortniteSeries;
  images: { small: string; wide?: string };
  added: string;
}

export interface FortniteBean {
  id: string;
  cosmeticId: string;
  name: string;
  gender: string;
  images: { small: string; large: string };
  added: string;
}

export interface FortniteSingleItem {
  id: string;
  albumArt?: string;
  name: string;
  description?: string;
  type: FortniteType;
  rarity?: FortniteRarity;
  series?: FortniteSeries;
  set?: FortniteSet;
  images: FortniteImages;
  introduction?: FortniteIntroduction;
  added?: string;
}

export interface FortniteDataResponse {
  status: number;
  data: FortniteSingleItem[];
}

export interface FortniteApiNewResponse {
  status: number;
  data: FortniteNewData;
}

export interface FortniteNewData {
  date: string;
  build: string;
  previousBuild: string;
  hashes: FortniteHashes;
  lastAdditions: FortniteLastAdditions;
  items: FortniteItems;
}

export interface FortniteHashes {
  all: string;
  br: string;
  tracks: string;
  instruments: string;
  cars: string;
  lego: string;
  legoKits: string;
  beans: string;
}

export interface FortniteLastAdditions {
  all: string;
  br: string;
  tracks: string;
  instruments: string;
  cars: string;
  lego: string;
  legoKits: string;
  beans: string;
}

export interface FortniteItems {
  br: FortniteBr[];
  tracks: FortniteTrack[];
  instruments: FortniteInstrument[];
  cars: FortniteCar[];
  lego: FortniteLego[];
  legoKits: FortniteLegoKit[];
  beans: FortniteBean[];
}

export interface SearchFilters {
  name: string;
  type: string;
  rarity: string;
  set: string;
  sortBy: string;
  page: number;
  pageSize: number;
}

export interface ShopLayout {
  id: string;
  name: string;
  index: number;
  rank: number;
  showIneligibleOffers: string;
  useWidePreview: boolean;
  displayType: string;
  category?: string;
  background?: {
    stage: string;
    _type: string;
    key: string;
  } | null;
}

export interface ShopBundle {
  name: string;
  info: string;
  image: string;
}

export interface ShopBanner {
  value: string;
  intensity: string;
  backendValue: string;
}

export interface ShopOfferTag {
  id: string;
  text: string;
}

export interface ShopNewDisplayAsset {
  id: string;
  cosmeticId?: string;
  materialInstances: [];
  renderImages: Array<{
    productTag: string;
    fileName: string;
    image: string;
  }>;
}

export interface ShopSection {
  id: string;
  name: string;
  index: number;
  landingPriority: number;
}

export interface ShopEntryItem {
  regularPrice: number;
  finalPrice: number;
  devName: string;
  offerId: string;
  inDate?: string;
  outDate?: string;
  giftable: boolean;
  refundable: boolean;
  sortPriority: number;
  layoutId?: string;
  layout?: ShopLayout;
  bundle?: ShopBundle;
  banner?: ShopBanner;
  categories?: string[];
  sectionId?: string;
  section?: ShopSection;
  displayAssetPath?: string;
  tileSize?: "Small" | "DoubleWide" | "Normal" | string;
  newDisplayAssetPath?: string;
  newDisplayAsset: ShopNewDisplayAsset;
  offerTag: ShopOfferTag;
  items: FortniteSingleItem[];
  tracks?: FortniteTrack[];
  brItems?: FortniteBr[];
  cars?: FortniteCar[];
  instruments?: FortniteInstrument[];
  legoKits?: FortniteLegoKit[];
}

export interface ShopData {
  hash: string;
  date: string;
  vbuckIcon: string;
  entries: ShopEntryItem[];
}

export interface ShopResponse {
  status: number;
  data: ShopData;
}

export interface ShopFilters {
  name: string;
  type: string;
  rarity: string;
  minPrice: number;
  maxPrice: number;
  section: string;
  layoutName: string;
  sortBy: "price" | "name" | "rarity" | "recent";
}

export function isShopResponse(data: any): data is ShopResponse {
  return (
    typeof data === "object" &&
    typeof data?.status === "number" &&
    typeof data?.data?.hash === "string" &&
    Array.isArray(data?.data?.entries)
  );
}

export function isFortniteSingleItem(data: any): data is FortniteSingleItem {
  return (
    typeof data === "object" &&
    typeof data?.id === "string" &&
    typeof data?.name === "string" &&
    typeof data?.type?.value === "string"
  );
}

export type ShopGroup = {
  layoutId: string;
  layoutName?: string;
  entries: ShopEntryItem[];
};

export type ShopDataType = {
  groups: ShopGroup[]; 
};
