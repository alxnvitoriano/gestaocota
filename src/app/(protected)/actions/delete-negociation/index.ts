"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import { negociationsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/safe-action";

import { deleteNegotiationSchema } from "./schema";

export const deleteNegotiationAction = actionClient
  .schema(deleteNegotiationSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Usuário não autenticado");
    }

    if (!session.user.company?.id) {
      throw new Error("Empresa não encontrada");
    }

    // Verificar se a negociação existe e pertence à empresa do usuário
    const existingNegotiation = await db.query.negociationsTable.findFirst({
      where: and(
        eq(negociationsTable.id, parsedInput.id),
        eq(negociationsTable.companyId, session.user.company.id),
      ),
    });

    if (!existingNegotiation) {
      throw new Error("Negociação não encontrada");
    }

    // Deletar a negociação
    await db
      .delete(negociationsTable)
      .where(
        and(
          eq(negociationsTable.id, parsedInput.id),
          eq(negociationsTable.companyId, session.user.company.id),
        ),
      );

    revalidatePath("/negotiations");

    return { success: true };
  });
