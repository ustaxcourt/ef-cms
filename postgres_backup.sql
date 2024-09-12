-- -------------------------------------------------------------
-- TablePlus 6.1.2(568)
--
-- https://tableplus.com/
--
-- Database: postgres
-- Generation Time: 2024-07-26 06:42:08.3820
-- -------------------------------------------------------------


-- This script only contains the table creation statements and does not fully represent the table in the database. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."case" (
    "docketNumber" varchar NOT NULL,
    "trialLocation" varchar,
    "trialDate" varchar,
    "docketNumberSuffix" varchar,
    PRIMARY KEY ("docketNumber")
);

-- This script only contains the table creation statements and does not fully represent the table in the database. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."message" (
    "attachments" jsonb,
    "caseStatus" varchar NOT NULL,
    "caseTitle" varchar NOT NULL,
    "completedAt" varchar,
    "completedBy" varchar,
    "completedBySection" varchar,
    "completedByUserId" varchar,
    "completedMessage" varchar,
    "createdAt" varchar NOT NULL,
    "docketNumber" varchar NOT NULL,
    "from" varchar NOT NULL,
    "fromSection" varchar NOT NULL,
    "fromUserId" varchar NOT NULL,
    "isCompleted" bool NOT NULL,
    "isRead" bool NOT NULL,
    "isRepliedTo" bool NOT NULL,
    "leadDocketNumber" varchar,
    "message" varchar NOT NULL,
    "messageId" varchar NOT NULL,
    "parentMessageId" varchar NOT NULL,
    "subject" varchar NOT NULL,
    "to" varchar NOT NULL,
    "toSection" varchar NOT NULL,
    "toUserId" varchar NOT NULL,
    PRIMARY KEY ("messageId")
);



-- Indices
CREATE UNIQUE INDEX "PK_22bea6459f33e75269daee9bb49" ON public."case" USING btree ("docketNumber");


-- Indices
CREATE INDEX "IDX_cca9e3abeff4b0939aa8a25b3e" ON public.message USING btree ("completedBySection");
CREATE INDEX "IDX_db0d579b205db9e5cea5e2e0df" ON public.message USING btree ("completedByUserId");
CREATE UNIQUE INDEX "PK_b664c8ae63d634326ce5896cecc" ON public.message USING btree ("messageId");
CREATE INDEX "IDX_5c6b9074994ba166011d5dd0b2" ON public.message USING btree ("docketNumber");
CREATE INDEX "IDX_c2d824eb9ff032e8caa384467d" ON public.message USING btree ("fromSection");
CREATE INDEX "IDX_c59262513a3006fd8f58bb4b7c" ON public.message USING btree ("fromUserId");
CREATE INDEX "IDX_575b24e003b8881e64fa53cd16" ON public.message USING btree ("parentMessageId");
CREATE INDEX "IDX_09e34b5dac1edc3182e0b349ef" ON public.message USING btree ("toSection");
CREATE INDEX "IDX_96789153e31e0bb7885ea13a27" ON public.message USING btree ("toUserId");
