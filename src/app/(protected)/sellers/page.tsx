import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { db } from "@/db";
import { pickupTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import AddSellersButton from "./components/add-sellers";
import SellersClient from "./components/sellers-client";

const SellersPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    redirect("/authentication");
  }

  const companyId = session.user.company?.id;
  if (!companyId) {
    return (
      <PageContainer>
        <PageHeader>
          <PageHeaderContent>
            <PageTitle>Vendedores</PageTitle>
            <PageDescription>
              Nenhuma empresa ativa. Crie uma empresa para gerenciar vendedores.
            </PageDescription>
          </PageHeaderContent>
        </PageHeader>
        <PageContent>
          <Link href="/company-form">
            <Button>Criar Empresa</Button>
          </Link>
        </PageContent>
      </PageContainer>
    );
  }

  // Verifica a role do usuário atual na empresa
  const meMember = await db.query.member.findFirst({
    where: (fields, { and, eq }) =>
      and(eq(fields.companyId, companyId), eq(fields.userId, session.user.id)),
    columns: { role: true },
  });
  const isGeneralManager = meMember?.role === "general_manager";

  const sellers = await db.query.salespersonTable.findMany({
    where: (fields, { and, eq }) =>
      isGeneralManager
        ? eq(fields.companyId, companyId)
        : and(
            eq(fields.companyId, companyId),
            eq(fields.name, session.user.name || ""),
          ),
  });

  const pickups = await db.query.pickupTable.findMany({
    where: eq(pickupTable.companyId, companyId),
    columns: { id: true, name: true },
  });

  // Buscar membros elegíveis com cargo 'salesperson' na empresa
  const members = await db.query.member.findMany({
    where: (fields, { and, eq }) =>
      and(eq(fields.companyId, companyId), eq(fields.role, "salesperson")),
    with: { user: true },
  });
  const eligibleUsers = members
    .filter((m) => !!m.user)
    .map((m) => ({
      id: m.user!.id,
      name: m.user!.name,
      email: m.user!.email,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Vendedores</PageTitle>
          <PageDescription>
            Gerencie seus vendedores e sua empresa.
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <AddSellersButton pickups={pickups} eligibleUsers={eligibleUsers} />
        </PageActions>
      </PageHeader>
      <PageContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"></div>
        <SellersClient
          sellers={sellers}
          pickups={pickups}
          eligibleUsers={eligibleUsers}
        />
      </PageContent>
    </PageContainer>
  );
};

export default SellersPage;
