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
    integer
} from "drizzle-orm/pg-core";
import { usersTable } from "./user";


export const visibilityEnum = pgEnum("visibility", ["public", "unlisted", "unpublished"]);


// internal title & description 
export const displayFormsTable = pgTable("display_forms", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
        .references(() => usersTable.id, { onDelete: "cascade" })
        .notNull(),
    title: varchar("title", { length: 255 }).notNull(), // display title of the form
    description: text("description"),

    slug: varchar("slug", { length: 255 }).notNull().unique(),

    // Timestamps for audit trails
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

// actual form payload table
export const formPayloadTable = pgTable("form_payload", {
    id: uuid("id").primaryKey().defaultRandom(),
    formId: uuid("form_id")
        .references(() => displayFormsTable.id, { onDelete: "cascade" })
        .notNull(),

    title: varchar("title", { length: 255 }).notNull(), //form title
    description: text("description"),

    // e.g., 'short_text', 'number', 'dropdown'. Validated by Zod at app level.
    type: varchar("type", { length: 255 }).notNull(),

    label: text("label").notNull(),
    placeholder: text("placeholder"),
    required: boolean("required").default(false).notNull(),

    // Fractional indexing (e.g., 1.5) for drag-and-drop ordering
    ordered: real("ordered").notNull(),

    // JSONB for type-specific configs (options for dropdowns, min/max limits, etc.)
    properties: jsonb("properties").default({}),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

// actual form table configuration table
export const formTableConfiguration = pgTable("form_table_configuration", {
    id: uuid("id").primaryKey().defaultRandom(),
    formId: uuid("form_id")
        .references(() => displayFormsTable.id, { onDelete: "cascade" })
        .notNull(),
    themeName: varchar("theme_name", { length: 100 }),
    visibility: visibilityEnum("visibility").default("unpublished").notNull(),
    properties: jsonb("properties").default({}), // extensible bucket for the entire form.
    protected: boolean("protected").default(false),
    password: varchar("password", { length: 255 }).default(""),
    expiry: timestamp("expiry"),
    allowAnonymous: boolean("allow_anonymous").default(false).notNull(),
    maxResponses: integer("max_responses"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),

})

// actual form responses table
export const formResponsesTable = pgTable("form_responses", {
    // Internal database primary key for the response.
    id: uuid("id").primaryKey().defaultRandom(),

    // Foreign key linking the response to the submitted form.
    formId: uuid("form_id")
        .references(() => displayFormsTable.id, { onDelete: "cascade" })
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
export type SelectForm = typeof displayFormsTable.$inferSelect;
export type InsertForm = typeof displayFormsTable.$inferInsert;

export type SelectFormField = typeof formPayloadTable.$inferSelect;
export type InsertFormField = typeof formPayloadTable.$inferInsert;

export type SelectFormResponse = typeof formResponsesTable.$inferSelect;
export type InsertFormResponse = typeof formResponsesTable.$inferInsert;