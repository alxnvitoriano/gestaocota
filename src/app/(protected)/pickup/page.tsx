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

import AddPickupButton from "./components/add-pickup";
import PickupCard from "./components/pickup-card";

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

  const pickups = await db.query.pickupTable.findMany({
    where: eq(pickupTable.companyId, companyId),
  });

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
          <AddPickupButton />
        </PageActions>
      </PageHeader>
      <PageContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {pickups.map((pickup) => (
            <PickupCard key={pickup.id} pickup={pickup} />
          ))}
        </div>
      </PageContent>
    </PageContainer>
  );
};

export default PickupPage;
