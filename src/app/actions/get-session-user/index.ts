"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export const getCurrentUser = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    redirect("/authentication");
  }

  const currentUser = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, session.user.id),
  });

  if (!currentUser) {
    redirect("/authentication");
  }

  return {
    ...session,
    currentUser,
  };
};
