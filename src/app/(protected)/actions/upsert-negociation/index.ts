"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import { negociationsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/safe-action";

import { upsertNegotiationSchema } from "./schema";

export const upsertNegotiationAction = actionClient
  .schema(upsertNegotiationSchema)
  .action(
    async ({
      parsedInput: {
        id,
        clientId,
        salespersonId,
        negociationValue,
        negociationResult,
        negociationStatus,
      },
    }) => {
      const session = await auth.api.getSession({
        headers: await headers(),
      });

      if (!session?.user?.id) {
        throw new Error("Usuário não autenticado");
      }

      if (!session.user.company?.id) {
        throw new Error("Empresa não selecionada");
      }

      let negotiation;

      if (id) {
        // Atualizar negociação existente
        [negotiation] = await db
          .update(negociationsTable)
          .set({
            clientId,
            salespersonId,
            negociationValue,
            negociationResult,
            negociationStatus,
            updatedAt: new Date(),
          })
          .where(eq(negociationsTable.id, id))
          .returning();

        if (!negotiation) {
          throw new Error("Negociação não encontrada");
        }
      } else {
        // Criar nova negociação
        [negotiation] = await db
          .insert(negociationsTable)
          .values({
            companyId: session.user.company.id,
            clientId,
            salespersonId,
            negociationValue,
            negociationResult,
            negociationStatus,
          })
          .returning();
      }

      revalidatePath("/negotiations");

      return { success: true, negotiation };
    },
  );
