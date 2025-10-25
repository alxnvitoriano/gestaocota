"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { member } from "@/db/schema";

import { canRemoveMembers } from "../permissions/permission";

export const removeMember = async (memberId: string, companyId: string) => {
  // Verificar se o usuário tem permissão para remover membros
  const permission = await canRemoveMembers(companyId);

  if (!permission.success) {
    return {
      success: false,
      error: permission.error || "Acesso negado.",
    };
  }

  try {
    await db.delete(member).where(eq(member.id, memberId));

    // Revalidar as páginas para atualizar os dados
    revalidatePath("/");
    revalidatePath(`/team/teams/${companyId}`);
    revalidatePath("/");
    revalidatePath("/team");

    return {
      success: true,
      message: "Membro removido com sucesso",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Falha ao remover membro",
    };
  }
};
