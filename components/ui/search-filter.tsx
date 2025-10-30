"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchFilterProps {
  placeholder?: string;
  onSearch: (searchTerm: string) => void;
  className?: string;
}

export function SearchFilter({
  placeholder = "Buscar por nome...",
  onSearch,
  className = "",
}: SearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setSearchTerm("");
    onSearch("");
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      <div className="relative flex-1">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pr-10 pl-10"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="hover:bg-muted absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
