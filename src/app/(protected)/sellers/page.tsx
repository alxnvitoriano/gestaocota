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
import { pickupTable, salespersonTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import AddSellersButton from "./components/add-sellers";
import SellerCard from "./components/seller-card";

const SellersPage = async () => {
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
            <PageTitle>Vendedores</PageTitle>
            <PageDescription>
              Nenhuma empresa ativa. Crie uma empresa para gerenciar vendedores.
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

  const sellers = await db.query.salespersonTable.findMany({
    where: eq(salespersonTable.companyId, companyId),
  });

  const pickups = await db.query.pickupTable.findMany({
    where: eq(pickupTable.companyId, companyId),
    columns: { id: true, name: true },
  });

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Vendedores</PageTitle>
          <PageDescription>
            Gerencie seus vendedores e sua empresa.
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <AddSellersButton pickups={pickups} />
        </PageActions>
      </PageHeader>
      <PageContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sellers.map((seller) => (
            <SellerCard key={seller.id} seller={seller} pickups={pickups} />
          ))}
        </div>
      </PageContent>
    </PageContainer>
  );
};

export default SellersPage;
