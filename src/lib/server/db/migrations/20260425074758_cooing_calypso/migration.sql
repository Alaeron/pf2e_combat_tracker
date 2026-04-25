ALTER TABLE `session_creature` ADD `name` text NOT NULL;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_session_condition` (
	`session_id` integer NOT NULL,
	`creature_id` integer NOT NULL,
	`condition_id` integer NOT NULL,
	`value` integer DEFAULT NULL,
	CONSTRAINT `session_condition_pk` PRIMARY KEY(`session_id`, `creature_id`, `condition_id`),
	CONSTRAINT `fk_session_condition_session_id_session_id_fk` FOREIGN KEY (`session_id`) REFERENCES `session`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_session_condition_creature_id_session_creature_creature_id_fk` FOREIGN KEY (`creature_id`) REFERENCES `session_creature`(`creature_id`) ON DELETE CASCADE,
	CONSTRAINT `fk_session_condition_condition_id_condition_id_fk` FOREIGN KEY (`condition_id`) REFERENCES `condition`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
INSERT INTO `__new_session_condition`(`session_id`, `creature_id`, `condition_id`, `value`) SELECT `session_id`, `creature_id`, `condition_id`, `value` FROM `session_condition`;--> statement-breakpoint
DROP TABLE `session_condition`;--> statement-breakpoint
ALTER TABLE `__new_session_condition` RENAME TO `session_condition`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_session_creature` (
	`session_id` integer NOT NULL,
	`creature_id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text NOT NULL,
	`team_id` integer NOT NULL,
	`is_dead` integer DEFAULT false NOT NULL,
	`order` integer NOT NULL,
	`round` integer DEFAULT 0 NOT NULL,
	CONSTRAINT `fk_session_creature_session_id_session_id_fk` FOREIGN KEY (`session_id`) REFERENCES `session`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_session_creature_team_id_team_id_fk` FOREIGN KEY (`team_id`) REFERENCES `team`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
INSERT INTO `__new_session_creature`(`session_id`, `creature_id`, `team_id`, `is_dead`, `order`, `round`) SELECT `session_id`, `creature_id`, `team_id`, `is_dead`, `order`, `round` FROM `session_creature`;--> statement-breakpoint
DROP TABLE `session_creature`;--> statement-breakpoint
ALTER TABLE `__new_session_creature` RENAME TO `session_creature`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
DROP TABLE `creature`;