"use server";

import { revalidatePath } from "next/cache";

import { Role } from "@/db/schema";
import { auth } from "@/lib/auth";

export const addMember = async (
  companyId: string,
  userId: string,
  role: Role,
) => {
  try {
    await auth.api.addMember({
      body: {
        userId,
        organizationId: companyId,
        role,
      },
    });

    // Revalidar as páginas para atualizar os dados
    revalidatePath("/");
    revalidatePath(`/team/teams/${companyId}`);
  } catch (error) {
    console.error(error);
    throw new Error("Falha ao adicionar membro");
  }
};
