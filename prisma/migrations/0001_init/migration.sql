-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "vbucks" INTEGER NOT NULL DEFAULT 10000,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemsBuy" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "itemId" TEXT NOT NULL,
    "image" TEXT,
    "name" TEXT,
    "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ItemsBuy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfferBuy" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "offerId" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "image" TEXT,
    "offerTag" TEXT,
    "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OfferBuy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfferBuy_ItemsBuy" (
    "offerBuyId" INTEGER NOT NULL,
    "itemBuyId" INTEGER NOT NULL,

    CONSTRAINT "OfferBuy_ItemsBuy_pkey" PRIMARY KEY ("offerBuyId","itemBuyId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "ItemsBuy_userId_idx" ON "ItemsBuy"("userId");

-- CreateIndex
CREATE INDEX "ItemsBuy_itemId_idx" ON "ItemsBuy"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "ItemsBuy_userId_itemId_key" ON "ItemsBuy"("userId", "itemId");

-- CreateIndex
CREATE INDEX "OfferBuy_userId_idx" ON "OfferBuy"("userId");

-- CreateIndex
CREATE INDEX "OfferBuy_offerId_idx" ON "OfferBuy"("offerId");

-- CreateIndex
CREATE UNIQUE INDEX "OfferBuy_userId_offerId_key" ON "OfferBuy"("userId", "offerId");

-- CreateIndex
CREATE INDEX "OfferBuy_ItemsBuy_offerBuyId_idx" ON "OfferBuy_ItemsBuy"("offerBuyId");

-- CreateIndex
CREATE INDEX "OfferBuy_ItemsBuy_itemBuyId_idx" ON "OfferBuy_ItemsBuy"("itemBuyId");

-- AddForeignKey
ALTER TABLE "ItemsBuy" ADD CONSTRAINT "ItemsBuy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferBuy" ADD CONSTRAINT "OfferBuy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferBuy_ItemsBuy" ADD CONSTRAINT "OfferBuy_ItemsBuy_itemBuyId_fkey" FOREIGN KEY ("itemBuyId") REFERENCES "ItemsBuy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferBuy_ItemsBuy" ADD CONSTRAINT "OfferBuy_ItemsBuy_offerBuyId_fkey" FOREIGN KEY ("offerBuyId") REFERENCES "OfferBuy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Check constraints
ALTER TABLE "User"
  ADD CONSTRAINT "User_vbucks_positive" CHECK ("vbucks" >= 0);

ALTER TABLE "OfferBuy"
  ADD CONSTRAINT "OfferBuy_price_positive" CHECK ("price" > 0);

-- Comments to match the original dump
COMMENT ON TABLE "ItemsBuy" IS 'Itens individuais comprados pelos usuários';
COMMENT ON TABLE "OfferBuy" IS 'Ofertas compradas pelos usuários (podem conter múltiplos itens)';
COMMENT ON TABLE "OfferBuy_ItemsBuy" IS 'Relacionamento N para N entre ofertas e itens';
COMMENT ON TABLE "User" IS 'Tabela de usuários do sistema';

-- Trigger to keep User.updatedAt in sync
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS
$$
BEGIN
  NEW."updatedAt" = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "update_user_updated_at"
BEFORE UPDATE ON "User"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();