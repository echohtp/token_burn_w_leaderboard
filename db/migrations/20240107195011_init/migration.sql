-- CreateTable
CREATE TABLE "Wallet" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "pubkey" TEXT NOT NULL,
    "burnedTokens" INTEGER NOT NULL,
    "twitter" TEXT,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);
