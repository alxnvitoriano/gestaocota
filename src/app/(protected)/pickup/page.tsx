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
  if (!session.user.company) {
    redirect("/company-form");
  }

  const pickups = await db.query.pickupTable.findMany({
    where: eq(pickupTable.companyId, session.user.company.id),
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
