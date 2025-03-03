CREATE TABLE "users" (
	"id" serial NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp,
	"firstName" text,
	"lastName" text,
	"email" text,
	"phoneNumber" text,
	"hashedPassword" text
);
