-- CreateTable
CREATE TABLE "Seat" (
    "id" TEXT NOT NULL,
    "screenId" TEXT NOT NULL,
    "rowLabel" TEXT NOT NULL,
    "seatNumber" INTEGER NOT NULL,
    "section" TEXT NOT NULL,
    "seatType" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isAccessible" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Seat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Show" (
    "id" TEXT NOT NULL,
    "movieId" TEXT NOT NULL,
    "screenId" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "format" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Show_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShowSeat" (
    "id" TEXT NOT NULL,
    "showId" TEXT NOT NULL,
    "seatId" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "holdExpiresAt" TIMESTAMP(3),

    CONSTRAINT "ShowSeat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Seat_screenId_rowLabel_seatNumber_key" ON "Seat"("screenId", "rowLabel", "seatNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ShowSeat_showId_seatId_key" ON "ShowSeat"("showId", "seatId");

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_screenId_fkey" FOREIGN KEY ("screenId") REFERENCES "Screen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Show" ADD CONSTRAINT "Show_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Show" ADD CONSTRAINT "Show_screenId_fkey" FOREIGN KEY ("screenId") REFERENCES "Screen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShowSeat" ADD CONSTRAINT "ShowSeat_showId_fkey" FOREIGN KEY ("showId") REFERENCES "Show"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShowSeat" ADD CONSTRAINT "ShowSeat_seatId_fkey" FOREIGN KEY ("seatId") REFERENCES "Seat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
