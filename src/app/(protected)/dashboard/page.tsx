"use client";

import { DashboardStats } from "../components/dashboard-stats";

export function CRMDashboard() {
  return (
    <div className="grid-cols gap-4 sm:grid-cols-2">
      <div>
        <DashboardStats />
      </div>
    </div>
  );
}

export default function Page() {
  return <CRMDashboard />;
}
