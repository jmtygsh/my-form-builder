import {
    pgTable,
    uuid,
    varchar,
    timestamp,
    boolean,
    text,
    jsonb,
    pgEnum,
    real,
} from "drizzle-orm/pg-core";
import { usersTable } from "./user";

// --- Enums ---

// Unlisted forms should not appear in public-facing areas and should only be accessible through the direct form link.
// Public forms should be visible in public - facing areas of the app such as explore pages, template galleries or featured form sections.
// Unpublished forms should not accept responses.

export const visibilityEnum = pgEnum("visibility", ["public", "unlisted", "unpublished"]);
export const fieldTypeEnum = pgEnum("field_type", [
    "short_text",
    "long_text",
    "email",
    "number",
    "single_select",
    "multi_select",
    "dropdown",
    "checkbox",
    "rating",
    "date",
    "file_upload",
]);


// --- Tables ---
export const formsTable = pgTable("forms", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
        .references(() => usersTable.id, { onDelete: "cascade" })
        .notNull(),

    // The main title of the form. 
    // Example: "Job Application Form" 
    title: varchar("title", { length: 255 }).notNull(),

    // Unique identifier for the form. 
    // Used to uniquely identify and access the form. 
    // Example: 
    // title: "Job Application Form" 
    // slug: "job-application-form" 
    // 
    // This can also be used in URLs: 
    // /form/job-application-form/{id} a unique id for each form.
    // Example: /form/job-application-form/1234567890abcdef1234567890abcdef
    slug: varchar("slug", { length: 255 }).notNull().unique(),

    // A brief description or instructions for the form.
    description: text("description"),

    // Controls who can see and submit the form.
    visibility: visibilityEnum("visibility").default("unpublished").notNull(),

    // Identifier for the form's visual theme (e.g., 'anime', 'tech').
    theme: varchar("theme", { length: 100 }),

    // JSONB field for extensible bonus features (expiry, limits, password protection).
    settings: jsonb("settings").default({}),

    // to store form style configurations design by user
    style: jsonb("style").default({}),

    // Timestamps for audit trails
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});


export const formFieldsTable = pgTable("form_fields", {

    id: uuid("id").primaryKey().defaultRandom(),

    // Foreign key linking the field to its parent form.
    formId: uuid("form_id")
        .references(() => formsTable.id, { onDelete: "cascade" })
        .notNull(),

    // The type of input field (e.g., short_text, email, single_select).
    type: fieldTypeEnum("type").notNull(),

    // A stable frontend reference ID used for conditional logic and mapping.
    ref: varchar("ref", { length: 255 }),

    // The actual question or label shown to the respondent.
    label: text("label").notNull(),

    // Optional helper text to guide the respondent.
    description: text("description"),

    // Whether this field must be filled out before submission.
    isRequired: boolean("is_required").default(false).notNull(),

    // Used to sort and display fields in the correct sequence on the frontend.
    // Uses real (float) instead of integer to allow inserting items between existing ones without bulk updates.
    order: real("order").notNull(),

    // Type-specific configurations (e.g., choices for selects, min/max for numbers).
    properties: jsonb("properties").default({}),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});


export const formResponsesTable = pgTable("form_responses", {
    // Internal database primary key for the response.
    id: uuid("id").primaryKey().defaultRandom(),

    // Foreign key linking the response to the submitted form.
    formId: uuid("form_id")
        .references(() => formsTable.id, { onDelete: "cascade" })
        .notNull(),

    // Key-value map of form_fields.id to the respondent's submitted answers.
    answers: jsonb("answers").notNull(),

    // Tracks authenticated users or anonymous session strings for rate limiting.
    // this unique id will help us to identify the form response later.
    respondentId: varchar("respondent_id", { length: 255 }).notNull(),

    // Timestamp of when the form was submitted.
    createdAt: timestamp("created_at").defaultNow().notNull(),
});


// --- Types ---
export type SelectForm = typeof formsTable.$inferSelect;
export type InsertForm = typeof formsTable.$inferInsert;

export type SelectFormField = typeof formFieldsTable.$inferSelect;
export type InsertFormField = typeof formFieldsTable.$inferInsert;

export type SelectFormResponse = typeof formResponsesTable.$inferSelect;
export type InsertFormResponse = typeof formResponsesTable.$inferInsert;