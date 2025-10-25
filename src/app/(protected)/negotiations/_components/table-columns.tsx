"use client";

import { ColumnDef } from "@tanstack/react-table";

import { negociationsTable } from "@/db/schema";

import { NegociationsTableActions } from "./table-actions";

type SimpleClient = {
  id: string;
  name: string;
};

type SimpleSeller = {
  id: string;
  name: string;
};

type NegociationWithRelations = typeof negociationsTable.$inferSelect & {
  client: { name: string } | null;
  salesperson: { name: string } | null;
};

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export const createNegociationsTableColumns = (
  clients: SimpleClient[],
  sellers: SimpleSeller[],
): ColumnDef<NegociationWithRelations>[] => [
  {
    id: "client",
    accessorFn: (row) => row.client?.name || "Cliente não encontrado",
    header: "Cliente",
  },
  {
    id: "salesperson",
    accessorFn: (row) => row.salesperson?.name || "Vendedor não encontrado",
    header: "Vendedor",
  },
  {
    id: "negociationValue",
    accessorKey: "negociationValue",
    header: "Valor da Negociação",
    cell: ({ row }) => {
      return formatCurrency(row.getValue("negociationValue"));
    },
  },
  {
    id: "negociationResult",
    accessorKey: "negociationResult",
    header: "Resultado da Negociação",
    cell: ({ row }) => {
      return row.getValue("negociationResult") || "Resultado não encontrado";
    },
  },
  {
    id: "negociationStatus",
    accessorKey: "negociationStatus",
    header: "Status da Negociação",
    cell: ({ row }) => {
      return row.getValue("negociationStatus") || "Status não encontrado";
    },
  },
  {
    id: "actions",
    cell: (params) => {
      const negotiation = params.row.original;
      return (
        <NegociationsTableActions
          negotiation={negotiation}
          clients={clients}
          sellers={sellers}
        />
      );
    },
  },
];
