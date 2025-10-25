"use client";

import { ColumnDef } from "@tanstack/react-table";

import { clientsTable } from "@/db/schema";

import ClientsTableActions from "./table-actions";

function formatCurrency(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export const clientsTableColumns: ColumnDef<
  typeof clientsTable.$inferSelect
>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Nome",
  },
  {
    id: "phone",
    accessorKey: "phone",
    header: "Telefone",
  },
  {
    id: "indication",
    accessorKey: "indication",
    header: "Indicação",
  },
  {
    id: "annuncio",
    accessorKey: "annuncio",
    header: "Anúncio",
  },
  {
    id: "desire",
    accessorKey: "desire",
    header: "Desire",
  },
  {
    id: "entrance",
    accessorKey: "entrance",
    header: "Entrada",
    cell: ({ row }) => {
      const entranceValue = row.original.entrance || 0;
      return formatCurrency(entranceValue);
    },
  },
  {
    id: "actions",
    cell: (params) => {
      const client = params.row.original;
      return <ClientsTableActions client={client} />;
    },
  },
];
