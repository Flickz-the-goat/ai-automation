/*
  Warnings:

  - Added the required column `nodetype` to the `executionnodedata` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "executionnodedata" ADD COLUMN     "nodetype" TEXT NOT NULL;
