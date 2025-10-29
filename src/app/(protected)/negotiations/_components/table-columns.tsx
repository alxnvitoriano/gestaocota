"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

import { Badge } from "@/components/ui/badge";
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
  client: {
    id: string;
    name: string;
    pickup?: { id: string; name: string } | null;
  } | null;
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
  // Mapeamento de status para rótulos em PT-BR
  // Inclui chaves possivelmente existentes no banco para evitar exibir em inglês
  // pending | accepted | meeting | sold | notInterested | rejected
  // Variantes do Badge para reforçar visualmente cada estado
  // (utilizamos componentes shadcn/ui conforme padrão do projeto)

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
    id: "negociationStatus",
    accessorKey: "negociationStatus",
    header: "Status da Negociação",
    cell: ({ row }) => {
      const STATUS_LABELS: Record<string, string> = {
        cotacion: "Cotação",
        documentation: "Documentação",
        meeting: "Reunião",
        sold: "Vendeu",
        notInterested: "Desistiu",
        notCalled: "Não ligou",
        rejected: "Rejeitada",
      };

      const STATUS_VARIANTS: Record<
        string,
        "default" | "secondary" | "destructive" | "outline"
      > = {
        cotacion: "default",
        documentation: "default",
        meeting: "default",
        sold: "default",
        notInterested: "destructive",
        notCalled: "destructive",
        rejected: "destructive",
      };

      const raw = row.getValue("negociationStatus") as
        | string
        | null
        | undefined;
      const key = raw ?? "";
      const label = key ? (STATUS_LABELS[key] ?? key) : "Status não encontrado";
      const variant = key ? (STATUS_VARIANTS[key] ?? "outline") : "outline";

      return <Badge variant={variant}>{label}</Badge>;
    },
  },
  {
    id: "credit",
    accessorKey: "credit",
    header: "Crédito",
    cell: ({ row }) => {
      const raw = row.getValue("credit") as number | null | undefined;
      return (
        <span suppressHydrationWarning>{formatCurrency(raw)}</span>
      );
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
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Criado em",
    cell: ({ row }) => {
      const createdAt = row.original.createdAt as Date;
      return (
        <span suppressHydrationWarning>
          {createdAt ? dayjs(createdAt).format("DD/MM/YYYY HH:mm") : "—"}
        </span>
      );
    },
  },
  {
    id: "updatedAt",
    accessorKey: "updatedAt",
    header: "Atualizado em",
    cell: ({ row }) => {
      const updatedAt = row.original.updatedAt as Date | null;
      return (
        <span suppressHydrationWarning>
          {updatedAt ? dayjs(updatedAt).format("DD/MM/YYYY HH:mm") : "—"}
        </span>
      );
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
