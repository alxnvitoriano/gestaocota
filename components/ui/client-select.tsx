"use client";

import { Check, ChevronsUpDown, Search } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Client {
  id: string;
  name: string;
  cpf?: string;
}

interface ClientSelectProps {
  clients: Client[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function ClientSelect({
  clients,
  value,
  onValueChange,
  placeholder = "Selecione um cliente",
  disabled = false,
  className,
}: ClientSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  const selectedClient = clients.find((client) => client.id === value);

  const formatClientDisplay = (client: Client) => {
    if (client.name) {
      return client.name;
    }
  };

  const filterClients = (search: string, client: Client) => {
    const searchLower = search.toLowerCase();
    const nameMatch = client.name.toLowerCase().includes(searchLower);
    const cpfMatch = client.cpf
      ?.replace(/\D/g, "")
      .includes(search.replace(/\D/g, ""));

    return nameMatch || cpfMatch || false;
  };

  // Filtrar clientes baseado no valor de busca
  const filteredClients = React.useMemo(() => {
    if (!searchValue) return clients;
    return clients.filter((client) => filterClients(searchValue, client));
  }, [clients, searchValue]);

  const handleClientSelect = (clientId: string) => {
    onValueChange(clientId);
    setOpen(false);
    setSearchValue("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between text-left", className)}
          disabled={disabled}
        >
          <span
            className={cn(
              "truncate",
              !selectedClient && "text-muted-foreground",
            )}
          >
            {selectedClient ? formatClientDisplay(selectedClient) : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="z-60 w-(--radix-popover-trigger-width) p-0"
        align="start"
        sideOffset={4}
      >
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            placeholder="Buscar por nome ou CPF..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <ScrollArea className="max-h-[300px]">
          {filteredClients.length === 0 ? (
            <div className="py-6 text-center text-sm">
              Nenhum cliente encontrado.
            </div>
          ) : (
            <div className="p-1">
              {filteredClients.map((client) => (
                <div
                  key={client.id}
                  className={cn(
                    "hover:bg-accent hover:text-accent-foreground relative flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                    "select-none",
                  )}
                  onClick={() => handleClientSelect(client.id)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === client.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {formatClientDisplay(client)}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
