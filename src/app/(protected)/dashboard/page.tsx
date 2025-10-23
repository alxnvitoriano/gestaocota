"use client";

import { ActivitiesTimeline } from "./components/activities-timeline";
import { ContactsTable } from "./components/contact-table";
import { DashboardStats } from "./components/dashboard-stats";
import { DealsKanban } from "./components/deals-kanban";

export function CRMDashboard() {
  return (
    <div className="grid-cols gap-4 sm:grid-cols-2">
      <div>
        <DashboardStats />
      </div>
      <div>
        <ActivitiesTimeline />
      </div>
      <div>
        <ContactsTable />
      </div>
      <div>
        <DealsKanban />
      </div>
    </div>
  );
}

export default function Page() {
  return <CRMDashboard />;
}
