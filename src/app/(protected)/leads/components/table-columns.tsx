"use client";

import { ColumnDef } from "@tanstack/react-table";

import { clientsTable, pickupTable, salespersonTable } from "@/db/schema";

import ClientsTableActions from "./table-actions";

function formatCurrency(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export const getClientsTableColumns = (
  pickups: Pick<typeof pickupTable.$inferSelect, "id" | "name">[],
  sellers?: Pick<typeof salespersonTable.$inferSelect, "id" | "name">[],
  clientSelectedSellerMap?: Record<string, string | undefined>,
): ColumnDef<typeof clientsTable.$inferSelect>[] => [
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
    header: "Desejo",
  },
  {
    id: "pickup",
    header: "Captador",
    cell: ({ row }) => {
      const pickupName =
        pickups.find((p) => p.id === row.original.pickupId)?.name ?? "—";
      return pickupName;
    },
  },
  {
    id: "salesperson",
    header: "Vendedor",
    cell: ({ row }) => {
      const sellerId = clientSelectedSellerMap?.[row.original.id];
      if (!sellerId) return "—";
      const name = sellers?.find((s) => s.id === sellerId)?.name;
      return name ?? "—";
    },
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
      return (
        <ClientsTableActions
          client={client}
          pickups={pickups}
          sellers={sellers}
        />
      );
    },
  },
];
