import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
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
  if (!session.user.company?.id) redirect("/company-form");

  const companyId = session.user.company.id;

  const [clients, appointments, pickups, sellers, negociations] = await Promise.all([
    db.query.clientsTable.findMany({
      where: eq(clientsTable.companyId, companyId),
      columns: { id: true },
    }),
    db.query.appointmentsTable.findMany({
      where: eq(appointmentsTable.companyId, companyId),
      columns: { id: true, pickupId: true },
    }),
    db.query.pickupTable.findMany({
      where: eq(pickupTable.companyId, companyId),
      columns: { id: true, name: true },
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

  const sellerStats = sellers.map((s) => {
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

  const pickupStats = pickups.map((p) => {
    const pLeads = appointments.filter((a) => a.pickupId === p.id).length;
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
      </PageHeader>
      <PageContent>
        <DashboardClient
          companyId={companyId}
          metrics={metrics}
          sellerStats={sellerStats}
          pickupStats={pickupStats}
        />
      </PageContent>
    </PageContainer>
  );
}
