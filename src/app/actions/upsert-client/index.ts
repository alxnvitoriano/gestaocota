"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import { clientsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/safe-action";

import { upsertClientSchema } from "./schema";

export const upsertClient = actionClient
  .schema(upsertClientSchema)
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
      // Update existing client
      await db
        .update(clientsTable)
        .set({
          name: parsedInput.name,
          cpf: parsedInput.cpf,
          indication: parsedInput.indication,
          annuncio: parsedInput.annuncio,
          desire: parsedInput.desire,
          entrance: parsedInput.entranceValue,
          phone: parsedInput.phone,
          pickupId: parsedInput.pickupId,
        })
        .where(eq(clientsTable.id, parsedInput.id));
    } else {
      // Create new client
      await db.insert(clientsTable).values({
        name: parsedInput.name,
        cpf: parsedInput.cpf,
        indication: parsedInput.indication,
        annuncio: parsedInput.annuncio,
        desire: parsedInput.desire,
        entrance: parsedInput.entranceValue,
        phone: parsedInput.phone,
        pickupId: parsedInput.pickupId,
        companyId: session.user.company.id,
      });
    }

    revalidatePath("/leads");
  });
