"use client";

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
import { pickupTable, salespersonTable } from "@/db/schema";

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
  sellers: Pick<typeof salespersonTable.$inferSelect, "id" | "name">[];
  clientSellerMap: Record<string, string[]>;
}

export function ClientsClient({
  clients /*companyId*/,
  pickups,
  sellers,
  clientSellerMap,
}: ClientsClientProps) {
  const [filteredClients, setFilteredClients] = useState<Client[]>(clients);
  const [selectedPickupId, setSelectedPickupId] = useState<string | undefined>(
    undefined,
  );
  const [selectedSellerId, setSelectedSellerId] = useState<string | undefined>(
    undefined,
  );

  // Sincronizar dados filtrados quando os dados originais mudarem
  useEffect(() => {
    setFilteredClients(clients);
  }, [clients]);

  // Filtrar por captador e vendedor selecionados
  useEffect(() => {
    let next = clients;

    if (selectedPickupId && selectedPickupId !== "") {
      next = next.filter((c) => c.pickupId === selectedPickupId);
    }

    if (selectedSellerId && selectedSellerId !== "") {
      next = next.filter((c) => {
        const sellersForClient = clientSellerMap[c.id] || [];
        return sellersForClient.includes(selectedSellerId!);
      });
    }

    setFilteredClients(next);
  }, [selectedPickupId, selectedSellerId, clients, clientSellerMap]);

  return (
    <>
      {/* Filtros */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="pickup-filter">Captador</Label>
          <Select
            value={selectedPickupId ?? "all"}
            onValueChange={(value) =>
              setSelectedPickupId(value === "all" ? undefined : value)
            }
          >
            <SelectTrigger id="pickup-filter" className="w-full max-w-xs">
              <SelectValue placeholder="Filtrar por captador" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {pickups.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="seller-filter">Vendedor</Label>
          <Select
            value={selectedSellerId ?? "all"}
            onValueChange={(value) =>
              setSelectedSellerId(value === "all" ? undefined : value)
            }
          >
            <SelectTrigger id="seller-filter" className="w-full max-w-xs">
              <SelectValue placeholder="Filtrar por vendedor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {sellers.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

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
