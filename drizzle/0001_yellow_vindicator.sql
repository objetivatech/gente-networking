CREATE TABLE `activities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` enum('referral','business','meeting','testimonial') NOT NULL,
	`fromUserId` int NOT NULL,
	`toUserId` int,
	`groupId` int,
	`title` varchar(255),
	`description` text,
	`value` int,
	`points` int NOT NULL DEFAULT 0,
	`activityDate` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `activities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`category` varchar(100),
	`type` enum('video','document','presentation','link') NOT NULL,
	`url` text NOT NULL,
	`thumbnailUrl` text,
	`fileKey` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `groupMembers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`groupId` int NOT NULL,
	`userId` int NOT NULL,
	`joinedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `groupMembers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `groups` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`facilitatorId` int,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `groups_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `guests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320),
	`phone` varchar(20),
	`company` text,
	`invitedBy` int,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `guests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `meetingGuests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`meetingId` int NOT NULL,
	`guestId` int NOT NULL,
	`attended` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `meetingGuests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `meetings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`groupId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`meetingDate` timestamp NOT NULL,
	`location` text,
	`isCompleted` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `meetings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` varchar(50) NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`isRead` boolean NOT NULL DEFAULT false,
	`relatedId` int,
	`relatedType` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`company` text,
	`segment` text,
	`phone` varchar(20),
	`address` text,
	`city` varchar(100),
	`state` varchar(2),
	`zipCode` varchar(10),
	`bio` text,
	`avatarUrl` text,
	`linkedinUrl` text,
	`facebookUrl` text,
	`instagramUrl` text,
	`websiteUrl` text,
	`classification` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `profiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `scores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`groupId` int,
	`month` int NOT NULL,
	`totalPoints` int NOT NULL DEFAULT 0,
	`referralCount` int NOT NULL DEFAULT 0,
	`businessCount` int NOT NULL DEFAULT 0,
	`meetingCount` int NOT NULL DEFAULT 0,
	`testimonialCount` int NOT NULL DEFAULT 0,
	`totalBusinessValue` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `scores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('admin','facilitator','member','guest') NOT NULL DEFAULT 'member';--> statement-breakpoint
ALTER TABLE `activities` ADD CONSTRAINT `activities_fromUserId_users_id_fk` FOREIGN KEY (`fromUserId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `activities` ADD CONSTRAINT `activities_toUserId_users_id_fk` FOREIGN KEY (`toUserId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `activities` ADD CONSTRAINT `activities_groupId_groups_id_fk` FOREIGN KEY (`groupId`) REFERENCES `groups`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `contents` ADD CONSTRAINT `contents_createdBy_users_id_fk` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `groupMembers` ADD CONSTRAINT `groupMembers_groupId_groups_id_fk` FOREIGN KEY (`groupId`) REFERENCES `groups`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `groupMembers` ADD CONSTRAINT `groupMembers_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `groups` ADD CONSTRAINT `groups_facilitatorId_users_id_fk` FOREIGN KEY (`facilitatorId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `guests` ADD CONSTRAINT `guests_invitedBy_users_id_fk` FOREIGN KEY (`invitedBy`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `meetingGuests` ADD CONSTRAINT `meetingGuests_meetingId_meetings_id_fk` FOREIGN KEY (`meetingId`) REFERENCES `meetings`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `meetingGuests` ADD CONSTRAINT `meetingGuests_guestId_guests_id_fk` FOREIGN KEY (`guestId`) REFERENCES `guests`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `meetings` ADD CONSTRAINT `meetings_groupId_groups_id_fk` FOREIGN KEY (`groupId`) REFERENCES `groups`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `profiles` ADD CONSTRAINT `profiles_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `scores` ADD CONSTRAINT `scores_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `scores` ADD CONSTRAINT `scores_groupId_groups_id_fk` FOREIGN KEY (`groupId`) REFERENCES `groups`(`id`) ON DELETE set null ON UPDATE no action;