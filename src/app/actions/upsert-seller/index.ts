"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import { salespersonTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/safe-action";

import { upsertSellerSchema } from "./schema";

export const upsertSeller = actionClient
  .schema(upsertSellerSchema)
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
      // Update existing seller
      await db
        .update(salespersonTable)
        .set({
          name: parsedInput.name,
        })
        .where(eq(salespersonTable.id, parsedInput.id));
    } else {
      // Create new seller
      await db.insert(salespersonTable).values({
        name: parsedInput.name,
        companyId: session.user.company.id,
      });
    }
    
    revalidatePath("/sellers");
  });
