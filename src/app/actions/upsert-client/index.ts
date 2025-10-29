"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import { clientsTable, negociationsTable } from "@/db/schema";
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

    let clientId: string | undefined = parsedInput.id;

    if (parsedInput.id) {
      // Update existing client
      await db
        .update(clientsTable)
        .set({
          name: parsedInput.name,
          cpf: parsedInput.cpf || null,
          indication: parsedInput.indication,
          annuncio: parsedInput.annuncio,
          desire: parsedInput.desire,
          entrance: parsedInput.entranceValue,
          phone: parsedInput.phone,
          pickupId: parsedInput.pickupId ?? null,
        })
        .where(eq(clientsTable.id, parsedInput.id));
    } else {
      // Create new client
      const [created] = await db
        .insert(clientsTable)
        .values({
          name: parsedInput.name,
          cpf: parsedInput.cpf || null,
          indication: parsedInput.indication,
          annuncio: parsedInput.annuncio,
          desire: parsedInput.desire,
          entrance: parsedInput.entranceValue,
          phone: parsedInput.phone,
          pickupId: parsedInput.pickupId ?? null,
          companyId: session.user.company.id,
        })
        .returning();
      clientId = created?.id;
    }

    // Se um vendedor foi selecionado, garantir associação via negociação
    if (parsedInput.salespersonId && clientId) {
      // Validar que o vendedor pertence à empresa atual
      const seller = await db.query.salespersonTable.findFirst({
        where: (fields, { and, eq }) =>
          and(
            eq(fields.companyId, session.user.company!.id),
            eq(fields.id, parsedInput.salespersonId!),
          ),
        columns: { id: true },
      });

      if (seller) {
        // Evitar duplicidade: só cria se não existir vínculo igual
        const existing = await db.query.negociationsTable.findFirst({
          where: (fields, { and, eq }) =>
            and(
              eq(fields.companyId, session.user.company!.id),
              eq(fields.clientId, clientId!),
              eq(fields.salespersonId, parsedInput.salespersonId!),
            ),
          columns: { id: true },
        });

        if (!existing) {
          await db.insert(negociationsTable).values({
            companyId: session.user.company!.id,
            clientId: clientId!,
            salespersonId: parsedInput.salespersonId!,
          });
        }
      }
    }

    revalidatePath("/leads");
  });
