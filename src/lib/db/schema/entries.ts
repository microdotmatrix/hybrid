import { relations } from "drizzle-orm";
import { date, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { UserTable } from "./users";

export const EntryTable = pgTable("entry", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => UserTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  dateOfBirth: date("date_of_birth"),
  dateOfDeath: date("date_of_death"),
  birthLocation: text("birth_location"),
  deathLocation: text("death_location"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const EntryRelations = relations(EntryTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [EntryTable.userId],
    references: [UserTable.id],
  }),
}));

export const ObituaryDetailsTable = pgTable("obituary_details", {
  id: text("id").primaryKey(),
  entryId: text("entry_id")
    .notNull()
    .references(() => EntryTable.id, { onDelete: "cascade" })
    .unique(),
  // Occupation details
  occupation: text("occupation"),
  jobTitle: text("job_title"),
  companyName: text("company_name"),
  yearsWorked: text("years_worked"), // e.g., "1985-2010" or "15 years"

  // Education
  education: text("education"), // School names, degrees, etc.

  // Life summary and accomplishments
  accomplishments: text("accomplishments"), // Brief summary of achievements
  milestones: text("milestones"), // Important life events
  biographicalSummary: text("biographical_summary"), // Main life story

  // Personal details
  hobbies: text("hobbies"), // Hobbies and interests
  personalInterests: text("personal_interests"),

  // Family and relationships
  familyDetails: text("family_details"), // Spouse, children, parents, siblings
  survivedBy: text("survived_by"), // Who they are survived by
  precededBy: text("preceded_by"), // Who preceded them in death

  // Additional obituary information
  serviceDetails: text("service_details"), // Funeral/memorial service info
  donationRequests: text("donation_requests"), // Charity donation requests
  specialAcknowledgments: text("special_acknowledgments"), // Thank yous, special mentions
  additionalNotes: text("additional_notes"), // Any other relevant information

  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const ObituaryDetailsRelations = relations(
  ObituaryDetailsTable,
  ({ one }) => ({
    entry: one(EntryTable, {
      fields: [ObituaryDetailsTable.entryId],
      references: [EntryTable.id],
    }),
  })
);

export type Entry = typeof EntryTable.$inferSelect;
export type NewEntry = typeof EntryTable.$inferInsert;
export type ObituaryDetails = typeof ObituaryDetailsTable.$inferSelect;
export type NewObituaryDetails = typeof ObituaryDetailsTable.$inferInsert;
