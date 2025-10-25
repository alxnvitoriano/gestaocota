"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import z from "zod";

import { db } from "@/db";
import { clientsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/safe-action";

export const deleteClient = actionClient
  .schema(
    z.object({
      id: z.string().uuid(),
    }),
  )
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }
    if (!session?.user.company?.id) {
      throw new Error("Empresa não encontrada.");
    }

    const client = await db.query.clientsTable.findFirst({
      where: eq(clientsTable.id, parsedInput.id),
    });

    if (!client) {
      throw new Error("Cliente não encontrado.");
    }
    if (client.companyId !== session.user.company.id) {
      throw new Error("Cliente não pertence à sua empresa.");
    }

    await db.delete(clientsTable).where(eq(clientsTable.id, parsedInput.id));
    revalidatePath("/leads");
  });