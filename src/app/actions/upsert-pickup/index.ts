"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import { pickupTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/safe-action";

import { upsertPickupSchema } from "./schema";

export const upsertPickup = actionClient
  .schema(upsertPickupSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    if (!session?.user.company?.id) {
      throw new Error("Company not found");
    }

    if (parsedInput.id) {
      // Update existing pickup
      await db
        .update(pickupTable)
        .set({
          name: parsedInput.name,
        })
        .where(eq(pickupTable.id, parsedInput.id));
    } else {
      // Create new pickup
      await db.insert(pickupTable).values({
        name: parsedInput.name,
        companyId: session.user.company.id,
        userId: session.user.id,
      });
    }

    revalidatePath("/pickups");
  });
