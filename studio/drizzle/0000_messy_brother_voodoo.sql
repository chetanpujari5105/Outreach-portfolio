CREATE TABLE `sample_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`business` text NOT NULL,
	`reply_method` text NOT NULL,
	`contact` text NOT NULL,
	`brief` text NOT NULL,
	`website` text NOT NULL,
	`industry` text NOT NULL,
	`project` text NOT NULL,
	`solution` text NOT NULL,
	`network_hash` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `sample_requests_created` ON `sample_requests` (`created_at`);--> statement-breakpoint
CREATE INDEX `sample_requests_network_created` ON `sample_requests` (`network_hash`,`created_at`);--> statement-breakpoint
CREATE INDEX `sample_requests_contact_created` ON `sample_requests` (`contact`,`created_at`);