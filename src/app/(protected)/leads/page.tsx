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
import { clientsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import AddClientButton from "./components/add-client-button";
import { ClientsClient } from "./components/clients-client";

const ClientsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    redirect("/authentication");
  }
  if (!session.user.company) {
    redirect("/company-form");
  }

  const clients = await db.query.clientsTable.findMany({
    where: eq(clientsTable.companyId, session.user.company.id),
  });

  // Transformar os dados para o formato esperado pelo componente
  const formattedClients = clients.map((client) => ({
    ...client,
    entrance: client.entrance ?? 0,
    createdAt: client.createdAt.toISOString(),
    updatedAt: client.updatedAt?.toISOString() || null,
  }));

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Clientes</PageTitle>
          <PageDescription>
            Gerencie seus clientes e suas informações.
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <AddClientButton />
        </PageActions>
      </PageHeader>
      <PageContent>
        <ClientsClient
          clients={formattedClients}
          companyId={session.user.company.id}
        />
      </PageContent>
    </PageContainer>
  );
};

export default ClientsPage;
