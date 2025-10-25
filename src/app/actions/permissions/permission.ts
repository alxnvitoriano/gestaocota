"use server";

import { headers } from "next/headers";

import { db } from "@/db";
import { auth } from "@/lib/auth";

import { getCurrentUser } from "../get-session-user";

export const isAdmin = async () => {
  try {
    const { success, error } = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permission: {
          organization: ["update", "delete"],
        },
      },
    });
    if (error) {
      return {
        success: false,
        error: error || "Falha ao verificar permissão",
      };
    }

    return {
      success,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: error || "Falha ao verificar permissão",
    };
  }
};

export const canRemoveMembers = async (companyId: string) => {
  try {
    const session = await getCurrentUser();

    // Verificar se o usuário é membro da empresa e tem role adequada
    const userMember = await db.query.member.findFirst({
      where: (member, { and, eq }) =>
        and(
          eq(member.userId, session.user.id),
          eq(member.companyId, companyId),
        ),
    });

    if (!userMember) {
      return {
        success: false,
        error: "Usuário não é membro desta empresa",
      };
    }

    // Verificar se tem role de general_manager ou team_manager
    const hasPermission =
      userMember.role === "general_manager" ||
      userMember.role === "team_manager";

    return {
      success: hasPermission,
      error: hasPermission
        ? null
        : "Apenas gerentes gerais e de equipe podem remover membros",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Falha ao verificar permissão",
    };
  }
};
