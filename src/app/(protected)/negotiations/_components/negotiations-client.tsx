"use client";

import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";

import { DataTable } from "@/components/ui/data-table";
import { SearchFilter } from "@/components/ui/search-filter";
import { negociationsTable } from "@/db/schema";

import { searchNegociationsAction } from "../../actions/search-negotiations";
// import { SearchFilter } from "@/components/ui/search-filter";
import { createNegociationsTableColumns } from "./table-columns";

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
  } | null;
  salesperson: {
    id: string;
    name: string;
  } | null;
};

interface NegociationsClientProps {
  negociations: NegociationWithRelations[];
  companyId: string;
  clients: SimpleClient[];
  sellers: SimpleSeller[];
}

export function NegociationsClient({
  negociations,
  companyId,
  clients,
  sellers,
}: NegociationsClientProps) {
  const [filteredNegociations, setFilteredNegociations] =
    useState<NegociationWithRelations[]>(negociations);

  const { execute: searchNegociations } = useAction(searchNegociationsAction, {
    onSuccess: ({ data }) => {
      if (data) {
        setFilteredNegociations(data as NegociationWithRelations[]);
      }
    },
    onError: (error) => {
      console.error("Erro ao buscar negociações:", error);
      // Em caso de erro, manter os dados originais
      setFilteredNegociations(negociations);
    },
  });

  // Sincronizar dados filtrados quando os dados originais mudarem
  useEffect(() => {
    setFilteredNegociations(negociations);
  }, [negociations]);

  const handleSearch = (searchTerm: string) => {
    searchNegociations({
      companyId,
      searchTerm: searchTerm || undefined,
    });
  };

  return (
    <>
      <div className="mb-4">
        <SearchFilter
          placeholder="Buscar por cliente ou captador..."
          onSearch={handleSearch}
          className="max-w-md"
        />
      </div>

      <div className="rounded-md border">
        <DataTable
          columns={createNegociationsTableColumns(clients, sellers)}
          data={filteredNegociations}
        />
      </div>
    </>
  );
}
