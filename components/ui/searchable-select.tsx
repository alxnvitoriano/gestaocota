"use client";

import { Check, ChevronsUpDown, Search } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Item {
  id: string;
  name: string;
  cpf?: string | null;
}

interface SearchableSelectProps {
  items: Item[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function SearchableSelect({
  items,
  value,
  onValueChange,
  placeholder = "Selecione uma opção",
  disabled = false,
  className,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  const selectedItem = items.find((item) => item.id === value);

  const filterItems = (search: string, item: Item) => {
    const searchLower = search.toLowerCase();
    const nameMatch = item.name.toLowerCase().includes(searchLower);
    const cpfMatch = item.cpf
      ?.replace(/\D/g, "")
      .includes(search.replace(/\D/g, ""));
    return nameMatch || cpfMatch || false;
  };

  const filteredItems = React.useMemo(() => {
    if (!searchValue) return items;
    return items.filter((item) => filterItems(searchValue, item));
  }, [items, searchValue]);

  const handleSelect = (id: string) => {
    onValueChange(id);
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
          <span className={cn("truncate", !selectedItem && "text-muted-foreground")}>
            {selectedItem ? selectedItem.name : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="z-60 w-(--radix-popover-trigger-width) p-0" align="start" sideOffset={4}>
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
          {filteredItems.length === 0 ? (
            <div className="py-6 text-center text-sm">Nenhuma opção encontrada.</div>
          ) : (
            <div className="p-1">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "hover:bg-accent hover:text-accent-foreground relative flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                    "select-none",
                  )}
                  onClick={() => handleSelect(item.id)}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === item.id ? "opacity-100" : "opacity-0")} />
                  <span className="truncate">{item.name}</span>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}