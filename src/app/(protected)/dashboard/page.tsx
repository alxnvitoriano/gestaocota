"use client";

import { useState } from "react";

import { AppSidebar } from "@/app/(protected)/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { ActivitiesTimeline } from "./components/activities-timeline";
import { ContactsTable } from "./components/contact-table";
import { DashboardStats } from "./components/dashboard-stats";
import { DealsKanban } from "./components/deals-kanban";

type View = "dashboard" | "contacts" | "deals" | "activities";

export function CRMDashboard() {
  const [currentView, setCurrentView] = useState<View>("dashboard");

  return (
    <SidebarProvider>
      <AppSidebar currentView={currentView} onViewChange={setCurrentView} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">CRM</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage className="capitalize">
                  {currentView}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="mt-4">
            {currentView === "dashboard" && <DashboardStats />}
            {currentView === "contacts" && <ContactsTable />}
            {currentView === "deals" && <DealsKanban />}
            {currentView === "activities" && <ActivitiesTimeline />}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function Page() {
  return <CRMDashboard />;
}
