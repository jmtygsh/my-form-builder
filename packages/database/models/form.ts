import { relations } from "drizzle-orm";
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

// --- Shared Types & Constants ---
export type FormPayload = {
    name: string;
    rows: {
        id: string;
        fields: {
            id: string;
            type: string;
            props: Record<string, any>;
        }[];
    }[];
};

export const defaultFormPayload: FormPayload = {
    name: "Untitled Form",
    rows: []
};

// internal title & description 
export const displayFormsTable = pgTable("display_forms", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
        .references(() => usersTable.id, { onDelete: "cascade" })
        .notNull(),
    title: varchar("title", { length: 255 }).notNull(), // display title of the form
    description: text("description"),

    slug: varchar("slug", { length: 255 }).notNull().unique(),

    draft: jsonb("draft").$type<FormPayload>().default(defaultFormPayload),

    published: jsonb("published").$type<FormPayload>().default(defaultFormPayload),

    // Timestamps for audit trails
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});


// actual form table configuration table
export const formTableConfiguration = pgTable("form_table_configuration", {
    id: uuid("id").primaryKey().defaultRandom(),
    formId: uuid("form_id")
        .references(() => displayFormsTable.id, { onDelete: "cascade" })
        .notNull(),
    // themeName: varchar("theme_name", { length: 100 }),
    visibility: visibilityEnum("visibility").default("unpublished").notNull(),
    protected: boolean("protected").default(false),
    password: varchar("password", { length: 255 }).default(""),
    expiry: timestamp("expiry"),
    allowAnonymous: boolean("allow_anonymous").default(false).notNull(),
    maxResponses: integer("max_responses"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});


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


// --- Relations ---

export const displayFormsRelations = relations(displayFormsTable, ({ one, many }) => ({
    user: one(usersTable, {
        fields: [displayFormsTable.userId],
        references: [usersTable.id],
    }),
    configuration: one(formTableConfiguration),
    responses: many(formResponsesTable),
}));

export const formTableConfigurationRelations = relations(formTableConfiguration, ({ one }) => ({
    form: one(displayFormsTable, {
        fields: [formTableConfiguration.formId],
        references: [displayFormsTable.id],
    }),
}));

export const formResponsesRelations = relations(formResponsesTable, ({ one }) => ({
    form: one(displayFormsTable, {
        fields: [formResponsesTable.formId],
        references: [displayFormsTable.id],
    }),
}));


// --- Types ---
export type SelectForm = typeof displayFormsTable.$inferSelect;
export type InsertForm = typeof displayFormsTable.$inferInsert;

export type SelectFormResponse = typeof formResponsesTable.$inferSelect;
export type InsertFormResponse = typeof formResponsesTable.$inferInsert;
