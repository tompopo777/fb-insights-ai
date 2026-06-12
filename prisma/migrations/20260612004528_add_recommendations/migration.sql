/*
  Warnings:

  - Added the required column `recommendations` to the `Analysis` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Analysis" ADD COLUMN     "recommendations" TEXT NOT NULL;
