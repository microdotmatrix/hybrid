CREATE TABLE "entry" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"date_of_birth" date,
	"date_of_death" date,
	"birth_location" text,
	"death_location" text,
	"image_url" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "obituary_details" (
	"id" text PRIMARY KEY NOT NULL,
	"entry_id" text NOT NULL,
	"occupation" text,
	"job_title" text,
	"company_name" text,
	"years_worked" text,
	"education" text,
	"accomplishments" text,
	"milestones" text,
	"biographical_summary" text,
	"hobbies" text,
	"personal_interests" text,
	"family_details" text,
	"survived_by" text,
	"preceded_by" text,
	"service_details" text,
	"donation_requests" text,
	"special_acknowledgments" text,
	"additional_notes" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "obituary_details_entry_id_unique" UNIQUE("entry_id")
);
--> statement-breakpoint
ALTER TABLE "entry" ADD CONSTRAINT "entry_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "obituary_details" ADD CONSTRAINT "obituary_details_entry_id_entry_id_fk" FOREIGN KEY ("entry_id") REFERENCES "public"."entry"("id") ON DELETE cascade ON UPDATE no action;