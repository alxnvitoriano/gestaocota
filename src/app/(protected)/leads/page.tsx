import { and, eq, inArray } from "drizzle-orm";
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
import {
  clientsTable,
  negociationsTable,
  pickupTable,
  salespersonTable,
} from "@/db/schema";
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

  const companyId = session.user.company?.id;
  if (!companyId) {
    return (
      <PageContainer>
        <PageHeader>
          <PageHeaderContent>
            <PageTitle>Clientes</PageTitle>
            <PageDescription>
              Nenhuma empresa ativa. Crie uma empresa para gerenciar clientes.
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
  // Verificar role do usuário
  const userMember = await db.query.member.findFirst({
    where: (m, { and, eq }) =>
      and(eq(m.userId, session.user.id), eq(m.companyId, companyId)),
  });
  const isGeneralManager = userMember?.role === "general_manager";

  // Limitar pickups conforme visibilidade
  const visiblePickups = await db.query.pickupTable.findMany({
    where: isGeneralManager
      ? eq(pickupTable.companyId, companyId)
      : and(
          eq(pickupTable.companyId, companyId),
          eq(pickupTable.userId, session.user.id),
        ),
    columns: { id: true, name: true },
  });

  const visiblePickupIds = visiblePickups.map((p) => p.id).filter(Boolean);

  const clients = await db.query.clientsTable.findMany({
    where: isGeneralManager
      ? eq(clientsTable.companyId, companyId)
      : and(
          eq(clientsTable.companyId, companyId),
          visiblePickupIds.length > 0
            ? inArray(clientsTable.pickupId, visiblePickupIds)
            : eq(clientsTable.id, "00000000-0000-0000-0000-000000000000"), // força vazio quando sem pickups
        ),
  });

  const pickups = visiblePickups;

  // Buscar vendedores da empresa
  const sellers = await db.query.salespersonTable.findMany({
    where: eq(salespersonTable.companyId, companyId),
    columns: { id: true, name: true },
  });

  // Buscar negociações para mapear clientes -> vendedores
  const negociations = await db.query.negociationsTable.findMany({
    where: eq(negociationsTable.companyId, companyId),
    columns: { clientId: true, salespersonId: true },
  });

  // Mapear quais vendedores têm negociações com cada cliente
  const clientSellerMap: Record<string, string[]> = {};
  for (const n of negociations) {
    if (!n.clientId || !n.salespersonId) continue;
    const list =
      clientSellerMap[n.clientId] ?? (clientSellerMap[n.clientId] = []);
    if (!list.includes(n.salespersonId)) list.push(n.salespersonId);
  }

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
          <AddClientButton pickups={pickups} />
        </PageActions>
      </PageHeader>
      <PageContent>
        <ClientsClient
          clients={formattedClients}
          companyId={companyId}
          pickups={pickups}
          sellers={sellers}
          clientSellerMap={clientSellerMap}
        />
      </PageContent>
    </PageContainer>
  );
};

export default ClientsPage;
