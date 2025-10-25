"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import z from "zod";

import { db } from "@/db";
import { salespersonTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/safe-action";

export const deleteSeller = actionClient
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

    const seller = await db.query.salespersonTable.findFirst({
      where: eq(salespersonTable.id, parsedInput.id),
    });
    if (!seller) {
      throw new Error("Vendedor não encontrado.");
    }
    if (seller.companyId !== session.user.company.id) {
      throw new Error("Vendedor não pertence à sua empresa.");
    }

    await db
      .delete(salespersonTable)
      .where(eq(salespersonTable.id, parsedInput.id));
    revalidatePath("/sellers");
  });
