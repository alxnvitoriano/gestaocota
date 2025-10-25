import { eq, inArray, not } from "drizzle-orm";

import { db } from "@/db";
import { member, usersTable } from "@/db/schema";

export const getUsers = async (companyId: string) => {
  try {
    // Validação para evitar query com companyId vazio
    if (!companyId || companyId.trim() === "") {
      return [];
    }

    const members = await db
      .select()
      .from(member)
      .where(eq(member.companyId, companyId));

    const users = await db
      .select()
      .from(usersTable)
      .where(
        not(
          inArray(
            usersTable.id,
            members.map((member) => member.userId),
          ),
        ),
      );
    return users;
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return [];
  }
};
