import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getCompanies } from "@/app/actions/get-companies";
import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { db } from "@/db";
import { member } from "@/db/schema";
import { auth } from "@/lib/auth";

import { CompanyButton } from "./componentss/company-button";
import TeamMembersTable from "./componentss/team-members-table";

const TeamPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    redirect("/authentication");
  }
  if (!session.user.company) {
    redirect("/company-form");
  }

  const companies = await getCompanies();

  // Buscar todos os membros da empresa atual
  const teamMembers = await db.query.member.findMany({
    where: eq(member.companyId, session.user.company.id),
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: (member, { asc }) => [asc(member.createdAt)],
  });

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Times</PageTitle>
          <PageDescription>Gerencie seus times e membros.</PageDescription>
        </PageHeaderContent>
        <div className="grid grid-cols-1 gap-4">
          <CompanyButton companies={companies} />
        </div>
      </PageHeader>
      <PageContent>
        <TeamMembersTable members={teamMembers} />
      </PageContent>
    </PageContainer>
  );
};

export default TeamPage;
