"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { companyTable } from "@/db/schema";

import { getCurrentUser } from "../get-session-user";

export async function getCompanies() {
  const session = await getCurrentUser();

  // Buscar empresas onde o usuário é owner (usersToCompanyTable)
  const ownedCompanies = await db.query.usersToCompanyTable.findMany({
    where: (usersToCompanyTable, { eq }) =>
      eq(usersToCompanyTable.userId, session.user.id),
  });

  // Buscar empresas onde o usuário é membro (member table)
  const memberCompanies = await db.query.member.findMany({
    where: (member, { eq }) => eq(member.userId, session.user.id),
  });

  // Combinar os IDs das empresas
  const allCompanyIds = [
    ...ownedCompanies.map((m) => m.companyId),
    ...memberCompanies.map((m) => m.companyId),
  ];

  // Remover duplicatas
  const uniqueCompanyIds = [...new Set(allCompanyIds)];

  if (uniqueCompanyIds.length === 0) {
    return [];
  }

  const companies = await db.query.companyTable.findMany({
    where: (companyTable, { inArray }) =>
      inArray(companyTable.id, uniqueCompanyIds),
  });

  return companies;
}

export async function getCompanyBySlug(slug: string) {
  const companies = await getCompanies();
  const company = companies.find((company) => company.slug === slug);
  return company;
}

export async function getCompBySlug(slug: string) {
  try {
    const compBySlug = await db.query.companyTable.findFirst({
      where: eq(companyTable.slug, slug),
      with: {
        members: {
          with: {
            user: true,
          },
        },
      },
    });
    return compBySlug;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getCompById(id: string) {
  try {
    const compById = await db.query.companyTable.findFirst({
      where: eq(companyTable.id, id),
      with: {
        members: {
          with: {
            user: true,
          },
        },
      },
    });
    return compById;
  } catch (error) {
    console.error(error);
    return null;
  }
}
