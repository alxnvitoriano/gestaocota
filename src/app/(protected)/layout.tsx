import { headers } from "next/headers";
import { Toaster } from "sonner";

import { SidebarProvider } from "@/components/ui/sidebar";
import { db } from "@/db";
import { auth } from "@/lib/auth";

import { AppHeader } from "./components/app-header";
import { AppSidebar } from "./components/app-sidebar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  let userRole: string | undefined = undefined;
  if (session?.user?.company?.id && session?.user?.id) {
    const meMember = await db.query.member.findFirst({
      where: (fields, { and, eq }) =>
        and(
          eq(fields.companyId, session.user.company!.id),
          eq(fields.userId, session.user.id),
        ),
      columns: { role: true },
    });
    userRole = meMember?.role;
  }

  return (
    <SidebarProvider>
      <AppSidebar userRole={userRole} />
      <main className="w-full">
        <AppHeader />
        {children}
        <Toaster />
      </main>
    </SidebarProvider>
  );
}
