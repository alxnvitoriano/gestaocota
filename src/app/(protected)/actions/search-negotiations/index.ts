"use server";

import { and, eq, ilike, or, SQL } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import {
  clientsTable,
  negociationsTable,
  pickupTable,
  salespersonTable,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/safe-action";

import { searchNegotiationsSchema } from "./schema";

export const searchNegociationsAction = actionClient
  .schema(searchNegotiationsSchema)
  .action(async ({ parsedInput: { companyId, searchTerm } }) => {
    const session = await auth.api.getSession({ headers: await headers() });

    let whereCondition: SQL<unknown> = eq(
      negociationsTable.companyId,
      companyId,
    );

    if (searchTerm && searchTerm.trim() !== "") {
      whereCondition = and(
        eq(negociationsTable.companyId, companyId),
        or(
          ilike(clientsTable.name, `%${searchTerm}%`),
          ilike(salespersonTable.name, `%${searchTerm}%`),
          ilike(pickupTable.name, `%${searchTerm}%`),
        ),
      )!;
    }

    const negotiations = await db
      .select({
        negociation: negociationsTable,
        client: {
          id: clientsTable.id,
          name: clientsTable.name,
        },
        salesperson: {
          id: salespersonTable.id,
          name: salespersonTable.name,
        },
        pickup: {
          id: pickupTable.id,
          name: pickupTable.name,
        },
      })
      .from(negociationsTable)
      .leftJoin(clientsTable, eq(negociationsTable.clientId, clientsTable.id))
      .leftJoin(
        salespersonTable,
        eq(negociationsTable.salespersonId, salespersonTable.id),
      )
      .leftJoin(pickupTable, eq(clientsTable.pickupId, pickupTable.id))
      .where(whereCondition)
      .orderBy(negociationsTable.createdAt);

    const mapped = negotiations.map((row) => ({
      ...row.negociation,
      client: row.client
        ? { ...row.client, pickup: row.pickup ?? null }
        : null,
      salesperson: row.salesperson ?? null,
    }));

    // Restringir por role
    let filtered = mapped;
    if (session?.user?.id && session.user.company?.id === companyId) {
      const meMember = await db.query.member.findFirst({
        where: (fields, { and, eq }) =>
          and(eq(fields.companyId, companyId), eq(fields.userId, session.user.id)),
        columns: { role: true },
      });

      const isGeneralManager = meMember?.role === "general_manager";
      const isPickup = meMember?.role === "pickup";

      if (!isGeneralManager) {
        // Buscar vendedores da empresa
        let sellers = await db.query.salespersonTable.findMany({
          where: eq(salespersonTable.companyId, companyId),
          columns: { id: true, name: true, pickupId: true },
        });

        let myPickupId: string | null = null;
        if (isPickup) {
          const myPickup = await db.query.pickupTable.findFirst({
            where: (fields, { and, eq }) =>
              and(eq(fields.companyId, companyId), eq(fields.userId, session.user.id)),
            columns: { id: true },
          });
          myPickupId = myPickup?.id ?? null;
          sellers = sellers.filter((s) => s.pickupId === myPickupId);
        } else {
          const myName = session.user.name || "";
          sellers = sellers.filter((s) => s.name === myName);
        }

        const allowedSellerIds = sellers.map((s) => s.id);

        filtered = isPickup
          ? mapped.filter(
              (n) =>
                (myPickupId && n.client?.pickup?.id === myPickupId) ||
                (n.salesperson?.id
                  ? allowedSellerIds.includes(n.salesperson.id)
                  : false),
            )
          : mapped.filter((n) =>
              n.salesperson?.id
                ? allowedSellerIds.includes(n.salesperson.id)
                : false,
            );
      }
    }

    return filtered;
  });
