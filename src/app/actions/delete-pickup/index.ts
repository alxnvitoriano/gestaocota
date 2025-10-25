"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import z from "zod";

import { db } from "@/db";
import { pickupTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/safe-action";

export const deletePickup = actionClient
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

    const pickup = await db.query.pickupTable.findFirst({
      where: eq(pickupTable.id, parsedInput.id),
    });
    if (!pickup) {
      throw new Error("Ponto de coleta não encontrado.");
    }
    if (pickup.companyId !== session.user.company.id) {
      throw new Error("Ponto de coleta não pertence à sua empresa.");
    }

    await db.delete(pickupTable).where(eq(pickupTable.id, parsedInput.id));
    revalidatePath("/pickups");
  });
