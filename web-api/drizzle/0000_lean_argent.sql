CREATE SCHEMA "dawson";
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dawson"."messages" (
	"attachments" jsonb DEFAULT '[]'::jsonb,
	"caseStatus" text,
	"caseTitle" text,
	"createdAt" timestamp,
	"docketNumber" text,
	"docketNumberWithSuffix" text,
	"entityName" text,
	"from" text,
	"fromSection" text,
	"fromUserId" uuid,
	"isCompleted" boolean DEFAULT false,
	"isRead" boolean DEFAULT false,
	"isRepliedTo" boolean DEFAULT false,
	"message" text,
	"messageId" uuid PRIMARY KEY NOT NULL,
	"parentMessageId" uuid,
	"subject" text,
	"to" text,
	"toSection" text,
	"toUserId" uuid
);
