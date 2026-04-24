CREATE TABLE `condition` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text NOT NULL,
	`category_id` integer NOT NULL,
	`value_required` integer DEFAULT true NOT NULL,
	CONSTRAINT `fk_condition_category_id_condition_category_id_fk` FOREIGN KEY (`category_id`) REFERENCES `condition_category`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `condition_category` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text NOT NULL,
	`color` text DEFAULT '#707070' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `creature` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text DEFAULT 'New Session' NOT NULL,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `session_condition` (
	`session_id` integer NOT NULL,
	`creature_id` integer NOT NULL,
	`condition_id` integer NOT NULL,
	`value` integer DEFAULT NULL,
	CONSTRAINT `session_condition_pk` PRIMARY KEY(`session_id`, `creature_id`, `condition_id`),
	CONSTRAINT `fk_session_condition_session_id_session_id_fk` FOREIGN KEY (`session_id`) REFERENCES `session`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_session_condition_creature_id_creature_id_fk` FOREIGN KEY (`creature_id`) REFERENCES `creature`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_session_condition_condition_id_condition_id_fk` FOREIGN KEY (`condition_id`) REFERENCES `condition`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `session_creature` (
	`session_id` integer NOT NULL,
	`creature_id` integer NOT NULL,
	`team_id` integer NOT NULL,
	`is_dead` integer DEFAULT false NOT NULL,
	`order` integer NOT NULL,
	`round` integer DEFAULT 0 NOT NULL,
	CONSTRAINT `session_creature_pk` PRIMARY KEY(`session_id`, `creature_id`),
	CONSTRAINT `fk_session_creature_session_id_session_id_fk` FOREIGN KEY (`session_id`) REFERENCES `session`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_session_creature_creature_id_creature_id_fk` FOREIGN KEY (`creature_id`) REFERENCES `creature`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_session_creature_team_id_team_id_fk` FOREIGN KEY (`team_id`) REFERENCES `team`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `team` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text NOT NULL,
	`color` text DEFAULT '#404040' NOT NULL
);
