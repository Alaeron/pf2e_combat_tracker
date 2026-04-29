ALTER TABLE `session_condition` RENAME COLUMN `auto_reduce` TO `auto_reduce_start`;--> statement-breakpoint
ALTER TABLE `session_condition` ADD `auto_reduce_end` integer DEFAULT NULL;