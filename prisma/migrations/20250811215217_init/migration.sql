-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "coins" INTEGER NOT NULL DEFAULT 0,
    "fishCaught" INTEGER NOT NULL DEFAULT 0,
    "x" DOUBLE PRECISION DEFAULT 250,
    "y" DOUBLE PRECISION DEFAULT 250,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BiggestFish" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "fishName" TEXT NOT NULL,
    "length" DOUBLE PRECISION NOT NULL,
    "tier" TEXT NOT NULL,
    "reward" INTEGER NOT NULL,
    "caughtAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BiggestFish_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "BiggestFish_userId_fishName_key" ON "public"."BiggestFish"("userId", "fishName");

-- AddForeignKey
ALTER TABLE "public"."BiggestFish" ADD CONSTRAINT "BiggestFish_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
