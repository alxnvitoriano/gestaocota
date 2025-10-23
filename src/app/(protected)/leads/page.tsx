import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  PageActions,
  PageContainer,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { Table, TableHeader } from "@/components/ui/table";
import { db } from "@/db";
import { clientsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import AddClientButton from "./components/add-client-button";

const ClientsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    redirect("/authentication");
  }

  const clients = await db.query.clientsTable.findMany({
    where: session.user.company
      ? eq(clientsTable.companyId, session.user.company.id)
      : undefined,
  });

  // Transformar os dados para o formato esperado pelo componente
  const formattedClients = clients.map((client) => ({
    ...client,
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
        <Table>
          <TableHeader>
            {formattedClients.map((client) => (
              <TableHeader key={client.id}>{client.name}</TableHeader>
            ))}
          </TableHeader>
        </Table>
      </PageHeader>
    </PageContainer>
  );
};

export default ClientsPage;
