ALTER TABLE `session_creature` RENAME COLUMN `creature_id` TO `id`;--> statement-breakpoint
ALTER TABLE `condition` ADD `created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL;--> statement-breakpoint
ALTER TABLE `condition` ADD `updated_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL;--> statement-breakpoint
ALTER TABLE `condition_category` ADD `created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL;--> statement-breakpoint
ALTER TABLE `condition_category` ADD `updated_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL;--> statement-breakpoint
ALTER TABLE `session_condition` ADD `created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL;--> statement-breakpoint
ALTER TABLE `session_condition` ADD `updated_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL;--> statement-breakpoint
ALTER TABLE `session_creature` ADD `created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL;--> statement-breakpoint
ALTER TABLE `session_creature` ADD `updated_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL;--> statement-breakpoint
ALTER TABLE `team` ADD `created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL;--> statement-breakpoint
ALTER TABLE `team` ADD `updated_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL;