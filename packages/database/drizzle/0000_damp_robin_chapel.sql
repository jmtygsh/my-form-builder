CREATE TYPE "public"."visibility" AS ENUM('public', 'unlisted', 'unpublished');--> statement-breakpoint
CREATE TABLE "password_reset_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"password_reset_token" text,
	"password_reset_expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" varchar(80) NOT NULL,
	"email" varchar(255) NOT NULL,
	"email_verified" boolean DEFAULT false,
	"profile_image_url" text,
	"password" text,
	"salt" text NOT NULL,
	"verification_token" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "display_forms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"slug" varchar(255) NOT NULL,
	"draft" jsonb DEFAULT '{"name":"Untitled Form","rows":[]}'::jsonb,
	"published" jsonb DEFAULT '{"name":"Untitled Form","rows":[]}'::jsonb,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "display_forms_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "form_responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"form_id" uuid NOT NULL,
	"answers" jsonb NOT NULL,
	"respondent_id" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "form_table_configuration" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"form_id" uuid NOT NULL,
	"visibility" "visibility" DEFAULT 'unpublished' NOT NULL,
	"protected" boolean DEFAULT false,
	"password" varchar(255) DEFAULT '',
	"expiry" timestamp,
	"allow_anonymous" boolean DEFAULT false NOT NULL,
	"max_responses" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "display_forms" ADD CONSTRAINT "display_forms_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_responses" ADD CONSTRAINT "form_responses_form_id_display_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."display_forms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_table_configuration" ADD CONSTRAINT "form_table_configuration_form_id_display_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."display_forms"("id") ON DELETE cascade ON UPDATE no action;