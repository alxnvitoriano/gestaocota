"use client";

// import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";

import { DataTable } from "@/components/ui/data-table";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

export function ClientsClient({
  clients /*companyId*/,
  pickups,
}: ClientsClientProps) {
  const [filteredClients, setFilteredClients] = useState<Client[]>(clients);
  const [selectedPickupId, setSelectedPickupId] = useState<string | undefined>(
    undefined,
  );

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

  // Filtrar por captador selecionado
  useEffect(() => {
    if (!selectedPickupId || selectedPickupId === "") {
      setFilteredClients(clients);
    } else {
      setFilteredClients(
        clients.filter((c) => c.pickupId === selectedPickupId),
      );
    }
  }, [selectedPickupId, clients]);

  //   const handleSearch = (searchTerm: string) => {
  //     searchClients({
  //       companyId,
  //       searchTerm: searchTerm || undefined,
  //     });
  //   };

  return (
    <>
      {/* Filtro por captador */}
      <div className="mb-4 flex items-center gap-2">
        <Label htmlFor="pickup-filter">Captador</Label>
        <Select
          value={selectedPickupId ?? ""}
          onValueChange={(value) => setSelectedPickupId(value || undefined)}
        >
          <SelectTrigger id="pickup-filter" className="w-full max-w-xs">
            <SelectValue placeholder="Filtrar por captador" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
            {pickups.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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
