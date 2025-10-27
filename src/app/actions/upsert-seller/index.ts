"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import { pickupTable, salespersonTable } from "@/db/schema";
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

    // Validate pickup exists and belongs to the company
    if (parsedInput.pickupId) {
      const pickup = await db.query.pickupTable.findFirst({
        where: eq(pickupTable.id, parsedInput.pickupId),
      });
      if (!pickup) {
        throw new Error("Captador não encontrado");
      }
      if (pickup.companyId !== session.user.company.id) {
        throw new Error("Captador não pertence à sua empresa");
      }
    }

    // If a userId is provided, ensure it belongs to a member with role 'salesperson' in the company
    let resolvedName: string | undefined;
    if (parsedInput.userId) {
      const eligibleMember = await db.query.member.findFirst({
        where: (fields, { and, eq }) =>
          and(
            eq(fields.companyId, session.user.company!.id),
            eq(fields.userId, parsedInput.userId!),
            eq(fields.role, "salesperson"),
          ),
        with: { user: true },
      });
      if (!eligibleMember || !eligibleMember.user) {
        throw new Error(
          "Membro com cargo 'salesperson' elegível não encontrado na empresa",
        );
      }
      resolvedName = eligibleMember.user.name;
    }

    if (parsedInput.id) {
      // Update existing seller
      await db
        .update(salespersonTable)
        .set({
          name: resolvedName ?? parsedInput.name,
          pickupId: parsedInput.pickupId ?? null,
        })
        .where(eq(salespersonTable.id, parsedInput.id));
    } else {
      // Create new seller
      await db.insert(salespersonTable).values({
        name: resolvedName ?? parsedInput.name,
        pickupId: parsedInput.pickupId ?? null,
        companyId: session.user.company.id,
      });
    }

    revalidatePath("/sellers");
  });
