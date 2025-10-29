import { getCompBySlug } from "@/app/actions/get-companies";
import { getUsers } from "@/app/actions/get-users";
import { canRemoveMembers } from "@/app/actions/permissions/permission";

import AllMembers from "./components/all-members";
import MembersTable from "./components/members-table";

type Params = Promise<{ slug: string }>;

export default async function CompanyPage({ params }: { params: Params }) {
  const { slug } = await params;
  const company = await getCompBySlug(slug);
  const users = company?.id ? await getUsers(company.id) : [];
  const canRemove = company?.id
    ? (await canRemoveMembers(company.id)).success
    : false;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 py-10">
      <h1 className="text-2xl font-bold">{company?.name}</h1>
      <MembersTable
        members={company?.members || []}
        companyId={company?.id || ""}
        canRemove={canRemove}
      />
      <AllMembers users={users} companyId={company?.id || ""} />
    </div>
  );
}
