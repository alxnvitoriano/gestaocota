"use client";

// import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";

import { DataTable } from "@/components/ui/data-table";
import { pickupTable } from "@/db/schema";

// import { searchClientsAction } from "@actions/search-clients";
// import { DataTable } from "@/components/ui/data-table";
// import { SearchFilter } from "@/components/ui/search-filter";
import { getClientsTableColumns } from "./table-columns";

interface Client {
  id: string;
  companyId: string | null;
  pickupId: string | null;
  name: string;
  cpf: string;
  entrance: number | null;
  phone: string | null;
  desire: string | null;
  indication: string | null;
  annuncio: string | null;
  createdAt: string;
  updatedAt: string | null;
}

interface ClientsClientProps {
  clients: Client[];
  companyId: string;
  pickups: Pick<typeof pickupTable.$inferSelect, "id" | "name">[];
}

export function ClientsClient({ clients /*companyId*/, pickups }: ClientsClientProps) {
  const [filteredClients, setFilteredClients] = useState<Client[]>(clients);

  //   const { execute: searchClients } = useAction(searchClientsAction, {
  // onSuccess: ({ data }) => {
  //   if (data) {
  // setFilteredClients(data as Client[]);
  //   }
  // },
  // onError: (error) => {
  //   console.error("Erro ao buscar clientes:", error);
  // Em caso de erro, manter os dados originais
  //   setFilteredClients(clients);
  // },
  //   });

  // Sincronizar dados filtrados quando os dados originais mudarem
  useEffect(() => {
    setFilteredClients(clients);
  }, [clients]);

  //   const handleSearch = (searchTerm: string) => {
  //     searchClients({
  //       companyId,
  //       searchTerm: searchTerm || undefined,
  //     });
  //   };

  return (
    <>
      {/* <div className="mb-4">
        <SearchFilter
          placeholder="Buscar por nome ou CPF..."
          onSearch={handleSearch}
          className="max-w-md"
        />
      </div> */}

      <div className="rounded-md border">
        <DataTable
          columns={getClientsTableColumns(pickups)}
          data={filteredClients.map((client) => ({
            ...client,
            createdAt: new Date(client.createdAt),
            updatedAt: client.updatedAt ? new Date(client.updatedAt) : null,
          }))}
        />
      </div>
    </>
  );
}
