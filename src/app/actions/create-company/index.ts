"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { companyTable, member, usersToCompanyTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export const createCompany = async (name: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // Gerar slug baseado no nome da empresa
  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[^a-z0-9\s-]/g, "") // Remove caracteres especiais
    .trim()
    .replace(/\s+/g, "-") // Substitui espaços por hífens
    .replace(/-+/g, "-"); // Remove hífens duplicados

  const [company] = await db
    .insert(companyTable)
    .values({ name, slug, userId: session.user.id })
    .returning();

  // Criar registro na tabela usersToCompany
  await db.insert(usersToCompanyTable).values({
    userId: session.user.id,
    companyId: company.id,
  });

  // Criar registro na tabela member para o usuário criador
  await db.insert(member).values({
    id: session.user.id, // Usando o ID do usuário como ID do membro
    companyId: company.id,
    userId: session.user.id,
    role: "general_manager", // Definindo como general_manager já que é quem criou a company
    createdAt: new Date(),
  });

  redirect("/dashboard");
};
