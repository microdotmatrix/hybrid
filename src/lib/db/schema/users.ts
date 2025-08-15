import { relations } from "drizzle-orm";
import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { UserSettingsTable } from "./settings";
import { UserUploadTable } from "./uploads";
import { EntryTable } from "./entries";

export const UserTable = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  role: text("role"),
  banned: boolean("banned"),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
});

export const UserRelations = relations(UserTable, ({ one, many }) => ({
  uploads: many(UserUploadTable),
  entries: many(EntryTable),
  settings: one(UserSettingsTable, {
    fields: [UserTable.id],
    references: [UserSettingsTable.userId],
  }),
}));

export type User = typeof UserTable.$inferSelect;
