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
import {
  appointmentsTable,
  clientsTable,
  negociationsTable,
  pickupTable,
  salespersonTable,
} from "@/db/schema";
import { auth } from "@/lib/auth";

import { DashboardClient } from "./_components/dashboard-client";

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) redirect("/authentication");

  const companyId = session.user.company?.id;
  if (!companyId) {
    return (
      <PageContainer>
        <PageHeader>
          <PageHeaderContent>
            <PageTitle>Dashboard</PageTitle>
            <PageDescription>
              Resumo de performance e atividades.
            </PageDescription>
          </PageHeaderContent>
          <PageActions>
            <Link href="/company-form">
              <Button>Criar Empresa</Button>
            </Link>
          </PageActions>
        </PageHeader>
        <PageContent>
          <p className="text-muted-foreground">
            Nenhuma empresa ativa. Crie uma empresa para visualizar métricas.
          </p>
        </PageContent>
      </PageContainer>
    );
  }

  const [clients, appointments, pickups, sellers, negociations] =
    await Promise.all([
      db.query.clientsTable.findMany({
        where: eq(clientsTable.companyId, companyId),
        columns: { id: true, pickupId: true },
      }),
      db.query.appointmentsTable.findMany({
        where: eq(appointmentsTable.companyId, companyId),
        columns: { id: true, pickupId: true },
      }),
      db.query.pickupTable.findMany({
        where: eq(pickupTable.companyId, companyId),
        columns: { id: true, name: true, userId: true },
      }),
      db.query.salespersonTable.findMany({
        where: eq(salespersonTable.companyId, companyId),
        columns: { id: true, name: true },
      }),
      db.query.negociationsTable.findMany({
        where: eq(negociationsTable.companyId, companyId),
        columns: {
          id: true,
          clientId: true,
          salespersonId: true,
          negociationStatus: true,
          negociationValue: true,
        },
      }),
    ]);

  // Descobrir a role do usuário na empresa
  const meMember = await db.query.member.findFirst({
    where: (fields, { and, eq }) =>
      and(eq(fields.companyId, companyId), eq(fields.userId, session.user.id)),
    columns: { role: true },
  });
  const isSalesperson = meMember?.role === "salesperson";
  const isPickup = meMember?.role === "pickup";
  const isGeneralManager = meMember?.role === "general_manager";

  const totalNegotiations = negociations.length;
  const acceptedNegotiations = negociations.filter(
    (n) => n.negociationStatus === "accepted",
  );
  const rejectedNegotiations = negociations.filter(
    (n) => n.negociationStatus === "rejected",
  );

  const totalSoldValue = acceptedNegotiations.reduce(
    (sum, n) => sum + (n.negociationValue ?? 0),
    0,
  );

  const generalConversion = totalNegotiations
    ? Math.round((acceptedNegotiations.length / totalNegotiations) * 100)
    : 0;

  const leadsReceived = clients.length;
  const leadsAccepted = acceptedNegotiations.length;
  const leadsConversion = leadsReceived
    ? Math.round((leadsAccepted / leadsReceived) * 100)
    : 0;

  const clientsWithNegotiations = new Set(
    negociations.map((n) => n.clientId).filter(Boolean) as string[],
  );
  const leadsTreatedCount = clientsWithNegotiations.size;

  // Se o usuário for vendedor (salesperson), mostrar apenas suas estatísticas
  const visibleSellers = isSalesperson
    ? sellers.filter((s) => s.name === (session.user.name || ""))
    : isPickup
      ? []
      : sellers;

  const sellerStats = visibleSellers.map((s) => {
    const sNeg = negociations.filter((n) => n.salespersonId === s.id);
    const sAccepted = sNeg.filter((n) => n.negociationStatus === "accepted");
    const conversion = sNeg.length
      ? Math.round((sAccepted.length / sNeg.length) * 100)
      : 0;
    return {
      id: s.id,
      name: s.name,
      negotiations: sNeg.length,
      accepted: sAccepted.length,
      conversion,
    };
  });

  const visiblePickups = isPickup
    ? pickups.filter((p) => p.userId === session.user.id)
    : isSalesperson
      ? []
      : pickups;

  const pickupStats = visiblePickups.map((p) => {
    const pLeads = clients.filter((c) => c.pickupId === p.id).length;
    return { id: p.id, name: p.name, leads: pLeads };
  });

  const metrics = {
    soldQuotationsCount: acceptedNegotiations.length,
    appointmentsCount: appointments.length,
    closingsCount: acceptedNegotiations.length,
    totalSoldValue,
    rejectedCount: rejectedNegotiations.length,
    generalConversion,
    leadsConversion,
    leadsReceived,
    leadsTreatedCount,
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Dashboard</PageTitle>
          <PageDescription>Resumo de performance e atividades.</PageDescription>
        </PageHeaderContent>
        <PageActions>
          {!isSalesperson && !isPickup && (
            <Link href="/company-form">
              <Button>Criar Empresa</Button>
            </Link>
          )}
        </PageActions>
      </PageHeader>
      <PageContent>
        <DashboardClient
          companyId={companyId}
          metrics={metrics}
          sellerStats={sellerStats}
          pickupStats={pickupStats}
          showMetrics={isGeneralManager}
        />
      </PageContent>
    </PageContainer>
  );
}
