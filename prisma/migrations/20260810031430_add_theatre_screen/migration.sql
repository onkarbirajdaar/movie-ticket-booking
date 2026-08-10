-- CreateTable
CREATE TABLE "Theatre" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "amenities" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Theatre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Screen" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "totalSeats" INTEGER NOT NULL,
    "theatreId" TEXT NOT NULL,

    CONSTRAINT "Screen_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Theatre" ADD CONSTRAINT "Theatre_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Screen" ADD CONSTRAINT "Screen_theatreId_fkey" FOREIGN KEY ("theatreId") REFERENCES "Theatre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
