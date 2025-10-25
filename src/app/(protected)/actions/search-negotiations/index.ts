"use server";

import { and, eq, ilike, SQL } from "drizzle-orm";

import { db } from "@/db";
import { clientsTable, negociationsTable, salespersonTable } from "@/db/schema";
import { actionClient } from "@/lib/safe-action";

import { searchNegotiationsSchema } from "./schema";

export const searchNegociationsAction = actionClient
  .schema(searchNegotiationsSchema)
  .action(async ({ parsedInput: { companyId, searchTerm } }) => {
    let whereCondition: SQL<unknown> = eq(
      negociationsTable.companyId,
      companyId,
    );

    if (searchTerm && searchTerm.trim() !== "") {
      whereCondition = and(
        eq(negociationsTable.companyId, companyId),
        ilike(clientsTable.name, `%${searchTerm}%`),
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
      })
      .from(negociationsTable)
      .leftJoin(clientsTable, eq(negociationsTable.clientId, clientsTable.id))
      .leftJoin(
        salespersonTable,
        eq(negociationsTable.salespersonId, salespersonTable.id),
      )
      .where(whereCondition)
      .orderBy(negociationsTable.createdAt);

    return negotiations.map((row) => ({
      ...row.negociation,
      client: row.client ?? null,
      salesperson: row.salesperson ?? null,
    }));
  });
