ALTER TABLE `practice_areas` MODIFY COLUMN `icon` varchar(100);--> statement-breakpoint
ALTER TABLE `practice_areas` MODIFY COLUMN `description` text;--> statement-breakpoint
ALTER TABLE `practice_areas` MODIFY COLUMN `display_order` int;--> statement-breakpoint
ALTER TABLE `practice_areas` ADD `detailed_content` text;--> statement-breakpoint
ALTER TABLE `practice_areas` ADD `featured_image` text;