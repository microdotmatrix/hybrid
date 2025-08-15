"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { EntryTable, ObituaryDetailsTable } from "@/lib/db/schema";
import { action } from "@/lib/utils";
import { randomBytes } from "crypto";
import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

const generateId = (length: number = 15) => {
  return randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);
};

const createEntrySchema = z.object({
  name: z.string().min(1, "Name is required"),
  dateOfBirth: z.string().optional(),
  dateOfDeath: z.string().optional(),
  birthLocation: z.string().optional(),
  deathLocation: z.string().optional(),
  imageUrl: z.string().optional(),
});

export const createEntry = action(createEntrySchema, async (data) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/login");
  }

  try {
    const entryId = generateId(15);
    const obituaryDetailsId = generateId(15);

    // Create entry and obituary details in transaction
    await db.transaction(async (tx) => {
      await tx.insert(EntryTable).values({
        id: entryId,
        userId: session.user.id,
        ...data,
        dateOfBirth: data.dateOfBirth || null,
        dateOfDeath: data.dateOfDeath || null,
      });

      // Create empty obituary details record
      await tx.insert(ObituaryDetailsTable).values({
        id: obituaryDetailsId,
        entryId,
      });
    });

    return {
      message: "Entry created successfully",
      success: true,
      entryId,
    };
  } catch (error) {
    console.error("Failed to create entry:", error);
    return {
      message: "Failed to create entry",
      success: false,
    };
  }
});

export async function getUserEntries() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return [];
  }

  try {
    const entries = await db
      .select()
      .from(EntryTable)
      .where(eq(EntryTable.userId, session.user.id))
      .orderBy(desc(EntryTable.createdAt));

    return entries;
  } catch (error) {
    console.error("Failed to fetch entries:", error);
    return [];
  }
}

export async function deleteEntry(entryId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/login");
  }

  try {
    await db.delete(EntryTable).where(eq(EntryTable.id, entryId));

    return { success: true };
  } catch (error) {
    console.error("Failed to delete entry:", error);
    return { success: false, error: "Failed to delete entry" };
  }
}
