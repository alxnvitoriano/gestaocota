import { and, eq } from "drizzle-orm";
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
import { compareStrings } from "@/lib/utils";

import AddPickupButton from "./components/add-pickup";
import PickupsClient from "./components/pickups-client";

const PickupPage = async () => {
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
            <PageTitle>Captadores</PageTitle>
            <PageDescription>
              Nenhuma empresa ativa. Crie uma empresa para gerenciar captadores.
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

  // Verificar role do usuário na empresa
  const userMember = await db.query.member.findFirst({
    where: (m, { and, eq }) =>
      and(eq(m.userId, session.user.id), eq(m.companyId, companyId)),
  });
  const isGeneralManager = userMember?.role === "general_manager";
  const isPickup = userMember?.role === "pickup";

  const pickups = await db.query.pickupTable.findMany({
    where: isGeneralManager
      ? eq(pickupTable.companyId, companyId)
      : and(
          eq(pickupTable.companyId, companyId),
          eq(pickupTable.userId, session.user.id),
        ),
  });

  // Buscar membros com role 'pickup' para seleção
  const pickupMembers = await db.query.member.findMany({
    where: (m, { and, eq }) =>
      and(eq(m.companyId, companyId), eq(m.role, "pickup")),
    with: { user: true },
  });

  const eligibleUsers = pickupMembers
    .map((m) => ({
      id: m.userId,
      name: m.user?.name ?? "",
      email: m.user?.email ?? "",
    }))
    // Ordena por nome para melhor UX
    .sort((a, b) => compareStrings(a.name, b.name));

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Captadores</PageTitle>
          <PageDescription>
            Gerencie seus captadores e sua empresa.
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          {!isPickup && <AddPickupButton eligibleUsers={eligibleUsers} />}
        </PageActions>
      </PageHeader>
      <PageContent>
        <PickupsClient pickups={pickups} eligibleUsers={eligibleUsers} />
      </PageContent>
    </PageContainer>
  );
};

export default PickupPage;
