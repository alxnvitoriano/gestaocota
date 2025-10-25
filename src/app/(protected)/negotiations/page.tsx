import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

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
import { clientsTable, negociationsTable, salespersonTable } from "@/db/schema";
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

  if (!session.user.company) {
    redirect("/company-form");
  }

  const companyId = session.user.company.id;
  if (!companyId) {
    redirect("/company-form");
  }

  // Buscar clientes da empresa
  const clients = await db.query.clientsTable.findMany({
    where: eq(clientsTable.companyId, companyId),
    columns: {
      id: true,
      name: true,
    },
  });

  // Buscar vendedores da empresa
  const sellers = await db.query.salespersonTable.findMany({
    where: eq(salespersonTable.companyId, companyId),
    columns: {
      id: true,
      name: true,
    },
  });

  // Buscar negociações da empresa com dados relacionados
  const negociations = await db.query.negociationsTable.findMany({
    where: eq(negociationsTable.companyId, companyId),
    with: {
      client: {
        columns: {
          id: true,
          name: true,
        },
      },
      salesperson: {
        columns: {
          id: true,
          name: true,
        },
      },
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
