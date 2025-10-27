"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import { pickupTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/safe-action";

import { upsertPickupSchema } from "./schema";

export const upsertPickup = actionClient
  .schema(upsertPickupSchema)
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
      // Update existing pickup
      const existing = await db.query.pickupTable.findFirst({
        where: eq(pickupTable.id, parsedInput.id),
      });
      if (!existing) {
        throw new Error("Captador não encontrado");
      }
      if (existing.companyId !== session.user.company.id) {
        throw new Error("Captador não pertence à sua empresa");
      }

      // Se userId foi enviado, validar que é membro pickup da empresa
      if (parsedInput.userId) {
        const eligibleMember = await db.query.member.findFirst({
          where: (m, { and, eq }) =>
            and(
              eq(m.userId, parsedInput.userId!),
              eq(m.companyId, session.user.company!.id),
              eq(m.role, "pickup"),
            ),
        });
        if (!eligibleMember) {
          throw new Error(
            "Usuário selecionado não é membro 'pickup' desta empresa",
          );
        }
      }

      await db
        .update(pickupTable)
        .set({
          name: parsedInput.name,
          userId: parsedInput.userId ?? existing.userId,
        })
        .where(eq(pickupTable.id, parsedInput.id));
    } else {
      // Create new pickup
      if (!parsedInput.userId) {
        throw new Error("Selecione o usuário captador");
      }

      // Validar que o usuário selecionado é membro da empresa com role 'pickup'
      const eligibleMember = await db.query.member.findFirst({
        where: (m, { and, eq }) =>
          and(
            eq(m.userId, parsedInput.userId!),
            eq(m.companyId, session.user.company!.id),
            eq(m.role, "pickup"),
          ),
      });

      if (!eligibleMember) {
        throw new Error(
          "Usuário selecionado não é membro 'pickup' desta empresa",
        );
      }

      await db.insert(pickupTable).values({
        name: parsedInput.name,
        companyId: session.user.company?.id,
        userId: parsedInput.userId,
      });
    }

    revalidatePath("/pickup");
  });
