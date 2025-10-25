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
import { salespersonTable } from "@/db/schema";
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
  if (!session.user.company) {
    redirect("/company-form");
  }

  const sellers = await db.query.salespersonTable.findMany({
    where: eq(salespersonTable.companyId, session.user.company.id),
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
          <AddSellersButton />
        </PageActions>
      </PageHeader>
      <PageContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sellers.map((seller) => (
            <SellerCard key={seller.id} seller={seller} />
          ))}
        </div>
      </PageContent>
    </PageContainer>
  );
};

export default SellersPage;
