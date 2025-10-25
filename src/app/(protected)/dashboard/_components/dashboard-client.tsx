"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Briefcase, DollarSign, TrendingUp, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";

type Metrics = {
  soldQuotationsCount: number;
  appointmentsCount: number;
  closingsCount: number;
  totalSoldValue: number;
  rejectedCount: number;
  generalConversion: number; // %
  leadsConversion: number; // %
  leadsReceived: number;
  leadsTreatedCount: number;
};

type SellerRow = {
  id: string;
  name: string;
  negotiations: number;
  accepted: number;
  conversion: number; // %
};

type PickupRow = {
  id: string;
  name: string;
  leads: number;
};

interface DashboardClientProps {
  companyId: string;
  metrics: Metrics;
  sellerStats: SellerRow[];
  pickupStats: PickupRow[];
}

export function DashboardClient({
  metrics,
  sellerStats,
  pickupStats,
}: DashboardClientProps) {
  const sellerColumns: ColumnDef<SellerRow>[] = [
    { accessorKey: "name", header: "Vendedor" },
    { accessorKey: "negotiations", header: "Negociações" },
    { accessorKey: "accepted", header: "Aceitas" },
    {
      accessorKey: "conversion",
      header: "Conversão",
      cell: ({ row }) => <span>{row.original.conversion}%</span>,
    },
  ];

  const pickupColumns: ColumnDef<PickupRow>[] = [
    { accessorKey: "name", header: "Captador" },
    { accessorKey: "leads", header: "Leads (agendamentos)" },
  ];

  const statCards = [
    {
      title: "Cotação vendida",
      value: metrics.soldQuotationsCount.toString(),
      icon: Briefcase,
    },
    {
      title: "Agendamentos",
      value: metrics.appointmentsCount.toString(),
      icon: Users,
    },
    {
      title: "Fechamentos",
      value: metrics.closingsCount.toString(),
      icon: Briefcase,
    },
    {
      title: "Valor total vendido",
      value: `R$ ${metrics.totalSoldValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
    },
    {
      title: "Não fecharam",
      value: metrics.rejectedCount.toString(),
      icon: Briefcase,
    },
    {
      title: "Conversão geral",
      value: `${metrics.generalConversion}%`,
      icon: TrendingUp,
    },
    {
      title: "Conversão de leads",
      value: `${metrics.leadsConversion}%`,
      icon: TrendingUp,
    },
    {
      title: "Leads recebidos",
      value: metrics.leadsReceived.toString(),
      icon: Users,
    },
    {
      title: "Leads tratados",
      value: metrics.leadsTreatedCount.toString(),
      icon: Users,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vendedores</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={sellerColumns} data={sellerStats} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Captadores</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={pickupColumns} data={pickupStats} />
        </CardContent>
      </Card>
    </div>
  );
}
