/*
  Warnings:

  - You are about to drop the `transaction_koin` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "transaction_koin" DROP CONSTRAINT "transaction_koin_user_id_fkey";

-- DropTable
DROP TABLE "transaction_koin";

-- CreateTable
CREATE TABLE "transactionKoin" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "target" TEXT NOT NULL,
    "method_target" TEXT NOT NULL,
    "method_pay" TEXT,
    "success_convert_amount" INTEGER,
    "status" "TransactionStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactionKoin_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "transactionKoin" ADD CONSTRAINT "transactionKoin_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
