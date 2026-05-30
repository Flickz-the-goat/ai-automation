-- DropForeignKey
ALTER TABLE "Workflows" DROP CONSTRAINT "fk_w_w";

-- AddForeignKey
ALTER TABLE "Workflows" ADD CONSTRAINT "fk_w_w" FOREIGN KEY ("workspaceid") REFERENCES "Workspaces"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
