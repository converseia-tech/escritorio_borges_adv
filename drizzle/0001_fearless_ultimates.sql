CREATE TABLE `about_content` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(200) NOT NULL,
	`subtitle` varchar(300),
	`content` text NOT NULL,
	`image` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `about_content_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `associated_lawyers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`oab` varchar(100) NOT NULL,
	`display_order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `associated_lawyers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `blog_images` (
	`id` int AUTO_INCREMENT NOT NULL,
	`blog_id` int NOT NULL,
	`image_url` text NOT NULL,
	`alt_text` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `blog_images_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `blogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(300) NOT NULL,
	`slug` varchar(300) NOT NULL,
	`content` text NOT NULL,
	`excerpt` text,
	`featured_image` text,
	`author_id` int,
	`published` int NOT NULL DEFAULT 0,
	`published_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `blogs_id` PRIMARY KEY(`id`),
	CONSTRAINT `blogs_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `contact_info` (
	`id` int AUTO_INCREMENT NOT NULL,
	`phone` varchar(50),
	`address` text,
	`email` varchar(320),
	`whatsapp` varchar(50),
	`hours` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contact_info_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hero_content` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` text NOT NULL,
	`subtitle` text NOT NULL,
	`cta_text` varchar(100) NOT NULL,
	`background_image` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `hero_content_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `practice_areas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(200) NOT NULL,
	`icon` text,
	`description` text NOT NULL,
	`slug` varchar(200) NOT NULL,
	`display_order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `practice_areas_id` PRIMARY KEY(`id`),
	CONSTRAINT `practice_areas_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `site_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`logo_url` text,
	`favicon_url` text,
	`social_media` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `site_settings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `team_members` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`position` varchar(200) NOT NULL,
	`bio` text,
	`image` text,
	`oab` varchar(100),
	`display_order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `team_members_id` PRIMARY KEY(`id`)
);
