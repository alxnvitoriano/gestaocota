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
  client:
    | { id: string; name: string; pickup?: { id: string; name: string } | null }
    | null;
  salesperson: { id: string; name: string } | null;
};

function formatCurrency(value: number | null | undefined) {
  const safe = typeof value === "number" ? value : 0;
  return safe.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export const createNegociationsTableColumns = (
  clients: SimpleClient[],
  sellers: SimpleSeller[],
  pickups: { id: string; name: string }[],
  readOnly?: boolean,
): ColumnDef<NegociationWithRelations>[] => [
  {
    id: "client",
    accessorFn: (row) => row.client?.name || "Cliente não encontrado",
    header: "Cliente",
  },
  {
    id: "pickup",
    accessorFn: (row) => row.client?.pickup?.name || "Captador não encontrado",
    header: "Captador",
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
      const raw = row.getValue("negociationValue") as number | null | undefined;
      return formatCurrency(raw);
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
          pickups={pickups}
          readOnly={!!readOnly}
        />
      );
    },
  },
];
