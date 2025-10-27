"use client";

import { useMemo, useState } from "react";

import { SearchFilter } from "@/components/ui/search-filter";
import { pickupTable } from "@/db/schema";

import PickupCard from "./pickup-card";

interface PickupsClientProps {
  pickups: typeof pickupTable.$inferSelect[];
  eligibleUsers: { id: string; name: string; email: string }[];
}

export default function PickupsClient({ pickups, eligibleUsers }: PickupsClientProps) {
  const [term, setTerm] = useState("");

  const filtered = useMemo(() => {
    const t = term.trim().toLowerCase();
    if (!t) return pickups;
    return pickups.filter((p) => p.name.toLowerCase().includes(t));
  }, [pickups, term]);

  return (
    <div className="flex flex-col gap-4">
      <SearchFilter
        placeholder="Buscar captador pelo nome..."
        onSearch={setTerm}
        className="max-w-md"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((pickup) => (
          <PickupCard key={pickup.id} pickup={pickup} eligibleUsers={eligibleUsers} />
        ))}
      </div>
    </div>
  );
}