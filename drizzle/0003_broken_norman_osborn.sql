CREATE TABLE "topics" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp,
	"folderId" integer,
	"creatorId" integer,
	"name" text,
	"description" text
);
--> statement-breakpoint
ALTER TABLE "flashcards" RENAME COLUMN "folderId" TO "topicId";--> statement-breakpoint
ALTER TABLE "flashcards" DROP CONSTRAINT "flashcards_folderId_folders_id_fk";
--> statement-breakpoint
ALTER TABLE "flashcards" ADD COLUMN "creatorId" integer;--> statement-breakpoint
ALTER TABLE "topics" ADD CONSTRAINT "topics_folderId_folders_id_fk" FOREIGN KEY ("folderId") REFERENCES "public"."folders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topics" ADD CONSTRAINT "topics_creatorId_users_id_fk" FOREIGN KEY ("creatorId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flashcards" ADD CONSTRAINT "flashcards_topicId_topics_id_fk" FOREIGN KEY ("topicId") REFERENCES "public"."topics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flashcards" ADD CONSTRAINT "flashcards_creatorId_users_id_fk" FOREIGN KEY ("creatorId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;