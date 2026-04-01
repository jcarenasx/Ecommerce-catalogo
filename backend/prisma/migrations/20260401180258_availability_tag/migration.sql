-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "availability_tag_id" TEXT;

-- CreateTable
CREATE TABLE "AvailabilityTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AvailabilityTag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AvailabilityTag_name_key" ON "AvailabilityTag"("name");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_availability_tag_id_fkey" FOREIGN KEY ("availability_tag_id") REFERENCES "AvailabilityTag"("id") ON DELETE SET NULL ON UPDATE CASCADE;
