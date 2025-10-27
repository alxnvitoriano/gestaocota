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
  const userRole = userMember?.role;
  const isGeneralManager = userRole === "general_manager";
  const isSalesperson = userRole === "salesperson";

  // Limitar pickups conforme visibilidade
  const visiblePickups = await db.query.pickupTable.findMany({
    where: isGeneralManager || isSalesperson
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
      : userRole === "pickup"
        ? and(
            eq(clientsTable.companyId, companyId),
            visiblePickupIds.length > 0
              ? inArray(clientsTable.pickupId, visiblePickupIds)
              : eq(
                  clientsTable.id,
                  "00000000-0000-0000-0000-000000000000",
                )
          )
        : eq(clientsTable.companyId, companyId),
  });

  const pickups = visiblePickups;

  // Buscar vendedores da empresa, respeitando visibilidade por role
  const sellers = await db.query.salespersonTable.findMany({
    where: isGeneralManager
      ? eq(salespersonTable.companyId, companyId)
      : userRole === "pickup"
        // Captador deve ver todos os vendedores da empresa
        ? eq(salespersonTable.companyId, companyId)
        : and(
            eq(salespersonTable.companyId, companyId),
            eq(salespersonTable.name, session.user.name || ""),
          ),
    columns: { id: true, name: true },
  });

  // Buscar negociações para obter vendedor selecionado (mais recente) por cliente
  const negociations = await db.query.negociationsTable.findMany({
    where: eq(negociationsTable.companyId, companyId),
    columns: { clientId: true, salespersonId: true, createdAt: true },
  });

  // Selecionar somente o vendedor mais recente por cliente
  const latestByClient = new Map<string, { salespersonId: string; createdAt: Date }>();
  for (const n of negociations) {
    if (!n.clientId || !n.salespersonId || !n.createdAt) continue;
    const existing = latestByClient.get(n.clientId);
    if (!existing || n.createdAt > existing.createdAt) {
      latestByClient.set(n.clientId, {
        salespersonId: n.salespersonId,
        createdAt: n.createdAt,
      });
    }
  }
  const clientSelectedSellerMap: Record<string, string> = {};
  latestByClient.forEach((val, clientId) => {
    clientSelectedSellerMap[clientId] = val.salespersonId;
  });

  // Restringir clientes conforme vendedor logado (quando não é gerente)
  const allowedSellerIds = sellers.map((s) => s.id);
  const serverVisibleClients =
    isGeneralManager || userRole === "pickup"
      ? clients
      : clients.filter((client) => {
          const sellerId = clientSelectedSellerMap[client.id];
          return !!sellerId && allowedSellerIds.includes(sellerId);
        });

  // Transformar os dados para o formato esperado pelo componente
  const formattedClients = serverVisibleClients.map((client) => ({
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
          <AddClientButton pickups={pickups} sellers={sellers} />
        </PageActions>
      </PageHeader>
      <PageContent>
        <ClientsClient
          clients={formattedClients}
          companyId={companyId}
          pickups={pickups}
          sellers={sellers}
          clientSelectedSellerMap={clientSelectedSellerMap}
        />
      </PageContent>
    </PageContainer>
  );
};

export default ClientsPage;
