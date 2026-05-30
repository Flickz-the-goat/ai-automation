-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "firstname" VARCHAR(100) NOT NULL,
    "lastname" VARCHAR(100) NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "passwordhash" TEXT NOT NULL,
    "createdat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workspaces" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100),
    "ownerid" INTEGER NOT NULL,
    "createdat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Workspaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workflows" (
    "id" SERIAL NOT NULL,
    "workspaceid" INTEGER NOT NULL,
    "ownerid" INTEGER NOT NULL,
    "name" VARCHAR(100),
    "description" TEXT,
    "active" BOOLEAN NOT NULL,
    "triggertype" VARCHAR(100) NOT NULL,
    "triggerconfig" JSONB,
    "settings" TEXT,
    "nodes" JSONB NOT NULL,
    "edges" JSONB NOT NULL,
    "createdat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Workflows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Executions" (
    "id" SERIAL NOT NULL,
    "workflowid" INTEGER NOT NULL,
    "status" VARCHAR(100) NOT NULL,
    "triggerdata" JSONB,
    "startedat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedat" TIMESTAMP(6),
    "duration" INTEGER,
    "errormessage" VARCHAR(100),

    CONSTRAINT "Executions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "executionnodedata" (
    "id" SERIAL NOT NULL,
    "executionid" INTEGER NOT NULL,
    "nodeid" INTEGER NOT NULL,
    "status" VARCHAR(100),
    "inputdata" TEXT,
    "outputdata" TEXT,
    "errormessage" VARCHAR(100),
    "executiontime" INTEGER,
    "startedat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "executionnodedata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- AddForeignKey
ALTER TABLE "Workspaces" ADD CONSTRAINT "fk_w_o" FOREIGN KEY ("ownerid") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Workflows" ADD CONSTRAINT "fk_w_o" FOREIGN KEY ("ownerid") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Workflows" ADD CONSTRAINT "fk_w_w" FOREIGN KEY ("workspaceid") REFERENCES "Workspaces"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Executions" ADD CONSTRAINT "fk_e_w" FOREIGN KEY ("workflowid") REFERENCES "Workflows"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "executionnodedata" ADD CONSTRAINT "fk_en_e" FOREIGN KEY ("executionid") REFERENCES "Executions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
