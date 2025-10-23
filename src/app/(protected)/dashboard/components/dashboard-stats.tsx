"use client";

import { Briefcase, DollarSign, TrendingUp, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  {
    title: "Total Contacts",
    value: "2,543",
    change: "+12.5%",
    icon: Users,
  },
  {
    title: "Active Deals",
    value: "127",
    change: "+8.2%",
    icon: Briefcase,
  },
  {
    title: "Revenue",
    value: "$1.2M",
    change: "+23.1%",
    icon: DollarSign,
  },
  {
    title: "Conversion Rate",
    value: "32.8%",
    change: "+4.3%",
    icon: TrendingUp,
  },
];

export function DashboardStats() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-muted-foreground text-xs">
                <span className="text-accent">{stat.change}</span> from last
                month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Welcome to your CRM Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Navigate through the sidebar to manage your contacts, track deals,
            and view activities.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
