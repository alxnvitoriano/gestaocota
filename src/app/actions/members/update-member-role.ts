"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { member, Role } from "@/db/schema";

import { canUpdateMemberRole } from "../permissions/permission";

export const updateMemberRole = async (
  memberId: string,
  companyId: string,
  role: Role,
) => {
  // Verificar permissão: apenas gerente geral pode alterar cargos
  const permission = await canUpdateMemberRole(companyId);

  if (!permission.success) {
    return {
      success: false,
      error: permission.error || "Acesso negado.",
    };
  }

  try {
    // Garantir que o membro pertence à empresa
    const existingMember = await db.query.member.findFirst({
      where: (m, { and, eq }) => and(eq(m.id, memberId), eq(m.companyId, companyId)),
    });

    if (!existingMember) {
      return {
        success: false,
        error: "Membro não encontrado nesta empresa",
      };
    }

    await db
      .update(member)
      .set({ role })
      .where(and(eq(member.id, memberId), eq(member.companyId, companyId)));

    // Revalidar páginas relevantes
    revalidatePath("/");
    revalidatePath(`/team/teams/${companyId}`);
    revalidatePath("/team");

    return {
      success: true,
      message: "Cargo atualizado com sucesso",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Falha ao atualizar cargo do membro",
    };
  }
};