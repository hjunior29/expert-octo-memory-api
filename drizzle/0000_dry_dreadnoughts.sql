CREATE TABLE `flashcards` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	`deletedAt` integer,
	`topicId` integer,
	`creatorId` integer,
	`title` text,
	`question` text,
	`answer` text,
	`tags` text,
	`difficulty` text,
	`lastReviewed` integer,
	`reviewCount` integer,
	FOREIGN KEY (`topicId`) REFERENCES `topics`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`creatorId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `folders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	`deletedAt` integer,
	`creatorId` integer,
	`name` text,
	FOREIGN KEY (`creatorId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `topics` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	`deletedAt` integer,
	`folderId` integer,
	`creatorId` integer,
	`name` text,
	`description` text,
	`sharedId` text,
	FOREIGN KEY (`folderId`) REFERENCES `folders`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`creatorId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `topics_sharedId_unique` ON `topics` (`sharedId`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	`deletedAt` integer,
	`firstName` text,
	`lastName` text,
	`email` text,
	`phoneNumber` text,
	`hashedPassword` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);