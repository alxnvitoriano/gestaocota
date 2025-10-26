"use client";

import { useMemo, useState } from "react";

import { SearchFilter } from "@/components/ui/search-filter";
import { pickupTable, salespersonTable } from "@/db/schema";

import SellerCard from "./seller-card";

interface SellersClientProps {
  sellers: typeof salespersonTable.$inferSelect[];
  pickups: Pick<typeof pickupTable.$inferSelect, "id" | "name">[];
}

export default function SellersClient({ sellers, pickups }: SellersClientProps) {
  const [term, setTerm] = useState("");

  const filtered = useMemo(() => {
    const t = term.trim().toLowerCase();
    if (!t) return sellers;
    return sellers.filter((s) => s.name.toLowerCase().includes(t));
  }, [sellers, term]);

  return (
    <div className="flex flex-col gap-4">
      <SearchFilter
        placeholder="Buscar vendedor pelo nome..."
        onSearch={setTerm}
        className="max-w-md"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((seller) => (
          <SellerCard key={seller.id} seller={seller} pickups={pickups} />
        ))}
      </div>
    </div>
  );
}