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
import { clientsTable, salespersonTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import AddNegotiationButton from "./_components/add-negotiation-button";
import { NegociationsClient } from "./_components/negotiations-client";

const NegotiationsPage = async () => {
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
            <PageTitle>Negociações</PageTitle>
            <PageDescription>
              Nenhuma empresa ativa. Crie uma empresa para gerenciar
              negociações.
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

  // Buscar clientes da empresa
  const clients = await db.query.clientsTable.findMany({
    where: eq(clientsTable.companyId, companyId),
    columns: {
      id: true,
      name: true,
    },
  });

  // Descobrir a role do usuário na empresa
  const meMember = await db.query.member.findFirst({
    where: (fields, { and, eq }) =>
      and(eq(fields.companyId, companyId), eq(fields.userId, session.user.id)),
    columns: { role: true },
  });
  const isGeneralManager = meMember?.role === "general_manager";
  const isPickup = meMember?.role === "pickup";

  // Buscar vendedores permitidos conforme a role
  let sellers = await db.query.salespersonTable.findMany({
    where: eq(salespersonTable.companyId, companyId),
    columns: { id: true, name: true, pickupId: true },
  });

  if (!isGeneralManager) {
    if (isPickup) {
      // Vê vendedores que possuem relação com o pickup do usuário
      const myPickup = await db.query.pickupTable.findFirst({
        where: (fields, { and, eq }) =>
          and(
            eq(fields.companyId, companyId),
            eq(fields.userId, session.user.id),
          ),
        columns: { id: true },
      });
      const myPickupId = myPickup?.id ?? null;
      sellers = sellers.filter((s) => s.pickupId === myPickupId);
    } else {
      // Vendedor comum vê apenas a si mesmo (associação via nome do usuário)
      const myName = session.user.name || "";
      sellers = sellers.filter((s) => s.name === myName);
    }
  }

  // Buscar negociações com filtro por vendedores permitidos
  const allowedSellerIds = sellers.map((s) => s.id);
  const negociations = await db.query.negociationsTable.findMany({
    where: (fields, { and, eq, inArray }) =>
      isGeneralManager
        ? eq(fields.companyId, companyId)
        : and(
            eq(fields.companyId, companyId),
            inArray(fields.salespersonId, allowedSellerIds),
          ),
    with: {
      client: { columns: { id: true, name: true } },
      salesperson: { columns: { id: true, name: true } },
    },
  });

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Negociações</PageTitle>
          <PageDescription>
            Gerencie suas negociações e propostas comerciais.
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <AddNegotiationButton clients={clients} sellers={sellers} />
        </PageActions>
      </PageHeader>
      <PageContent>
        <NegociationsClient
          negociations={negociations}
          clients={clients}
          sellers={sellers}
          companyId={companyId}
        />
      </PageContent>
    </PageContainer>
  );
};

export default NegotiationsPage;
