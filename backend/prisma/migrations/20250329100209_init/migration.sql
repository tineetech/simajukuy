/*
  Warnings:

  - The values [customer,store_admin,super_admin] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `date_ob` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `verified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `verify_token` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `username` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('pending', 'process', 'success', 'failed');

-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('text', 'pict', 'video', 'polling', 'map');

-- CreateEnum
CREATE TYPE "StatusType" AS ENUM ('active', 'draft');

-- CreateEnum
CREATE TYPE "VerificationType" AS ENUM ('automatic', 'manual');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('pending', 'process', 'failed', 'success');

-- CreateEnum
CREATE TYPE "NotificationTarget" AS ENUM ('semua', 'guest', 'admin');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('access', 'failed', 'normal');

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('guest', 'admin');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
COMMIT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "date_ob",
DROP COLUMN "verified",
DROP COLUMN "verify_token",
ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verify_email_token" TEXT,
ALTER COLUMN "avatar" SET DEFAULT 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg',
ALTER COLUMN "google_id" SET DATA TYPE TEXT,
ALTER COLUMN "password" SET NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "username" SET NOT NULL;

-- CreateTable
CREATE TABLE "Koin" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Koin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction_koin" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "target" TEXT NOT NULL,
    "method_target" TEXT NOT NULL,
    "method_pay" TEXT,
    "success_convert_amount" INTEGER,
    "status" "TransactionStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transaction_koin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Artikel" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "banner" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT NOT NULL,
    "status" "StatusType" NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Artikel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Laporan" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "image" TEXT,
    "description" TEXT NOT NULL,
    "type_verification" "VerificationType" NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'pending',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Laporan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "target" "NotificationTarget" NOT NULL,
    "target_user_id" INTEGER,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT NOT NULL,
    "status_notification" "NotificationStatus" NOT NULL DEFAULT 'normal',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Postingan" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "type" "PostType" NOT NULL,
    "content" TEXT NOT NULL,
    "status" "StatusType" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Postingan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostinganImage" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PostinganImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostinganVideo" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "url_video" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PostinganVideo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostinganPolling" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "select_percentage" INTEGER NOT NULL DEFAULT 0,
    "select_user_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PostinganPolling_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiwayatChatbot" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "model" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RiwayatChatbot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Koin_user_id_key" ON "Koin"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Koin" ADD CONSTRAINT "Koin_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_koin" ADD CONSTRAINT "transaction_koin_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Artikel" ADD CONSTRAINT "Artikel_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Laporan" ADD CONSTRAINT "Laporan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_target_user_id_fkey" FOREIGN KEY ("target_user_id") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Postingan" ADD CONSTRAINT "Postingan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostinganImage" ADD CONSTRAINT "PostinganImage_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Postingan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostinganVideo" ADD CONSTRAINT "PostinganVideo_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Postingan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostinganPolling" ADD CONSTRAINT "PostinganPolling_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Postingan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostinganPolling" ADD CONSTRAINT "PostinganPolling_select_user_id_fkey" FOREIGN KEY ("select_user_id") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiwayatChatbot" ADD CONSTRAINT "RiwayatChatbot_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
