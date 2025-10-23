import { SidebarTrigger } from "@/components/ui/sidebar";

export async function AppHeader() {
  //   const session = await auth.api.getSession({
  //     headers: await headers(),
  //   });

  //   const currentCompany = session?.user?.company;

  return (
    <header className="bg-background flex h-14 items-center justify-between border-b px-3 sm:h-16 sm:px-4">
      <div className="flex items-center gap-2 sm:gap-4">
        <SidebarTrigger />
      </div>

      {/* <div className="flex items-center gap-2 sm:gap-4">
        currentCompanyId={currentCompany?.id}
        currentCompanyName={currentCompany?.name}
      </div> */}
    </header>
  );
}
