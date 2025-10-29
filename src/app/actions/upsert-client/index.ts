"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import { clientsTable, negociationsTable, pickupTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/safe-action";

import { upsertClientSchema } from "./schema";

export const upsertClient = actionClient
  .schema(upsertClientSchema)
  .action(async ({ parsedInput }) => {
    try {
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

      // Normalizar ids opcionais vindos do formulário ("" -> undefined)
      const normalizedPickupId =
        parsedInput.pickupId && parsedInput.pickupId.trim() !== ""
          ? parsedInput.pickupId
          : undefined;
      const normalizedSalespersonId =
        parsedInput.salespersonId && parsedInput.salespersonId.trim() !== ""
          ? parsedInput.salespersonId
          : undefined;

      // Validar pickupId (se fornecido) pertence à empresa e existe
      if (normalizedPickupId) {
        const pickup = await db.query.pickupTable.findFirst({
          where: eq(pickupTable.id, normalizedPickupId),
        });
        if (!pickup) {
          throw new Error("Captador não encontrado");
        }
        if (pickup.companyId !== session.user.company!.id) {
          throw new Error("Captador não pertence à sua empresa");
        }
      }

      if (parsedInput.id) {
        // Update existing client
        await db
          .update(clientsTable)
          .set({
            name: parsedInput.name,
            indication: parsedInput.indication,
            annuncio: parsedInput.annuncio,
            desire: parsedInput.desire,
            entrance: parsedInput.entranceValue,
            phone: parsedInput.phone,
            pickupId: normalizedPickupId ?? null,
          })
          .where(eq(clientsTable.id, parsedInput.id));
      } else {
        // Create new client
        const [created] = await db
          .insert(clientsTable)
          .values({
            name: parsedInput.name,
            indication: parsedInput.indication,
            annuncio: parsedInput.annuncio,
            desire: parsedInput.desire,
            entrance: parsedInput.entranceValue,
            phone: parsedInput.phone,
            pickupId: normalizedPickupId ?? null,
            companyId: session.user.company.id,
          })
          .returning();
        clientId = created?.id;
      }

      // Se um vendedor foi selecionado, garantir associação via negociação
      if (normalizedSalespersonId && clientId) {
        // Validar que o vendedor pertence à empresa atual
        const seller = await db.query.salespersonTable.findFirst({
          where: (fields, { and, eq }) =>
            and(
              eq(fields.companyId, session.user.company!.id),
              eq(fields.id, normalizedSalespersonId!),
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
              eq(fields.salespersonId, normalizedSalespersonId!),
            ),
          columns: { id: true },
        });

          if (!existing) {
            await db.insert(negociationsTable).values({
              companyId: session.user.company!.id,
              clientId: clientId!,
              salespersonId: normalizedSalespersonId!,
            });
          }
        }
      }

      revalidatePath("/leads");
    } catch (error) {
      console.error("[upsertClient] erro na adição/atualização de cliente:", {
        message: (error as Error)?.message,
        stack: (error as Error)?.stack,
        input: parsedInput,
      });
      throw error;
    }
  });
