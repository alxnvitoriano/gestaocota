"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Company } from "@/db/schema";

interface CompanyButtonProps {
  companies: Company[];
}

export function CompanyButton({ companies }: CompanyButtonProps) {
  return (
    <div className="grid-cols grid gap-4">
      {companies.map((company: Company) => {
        // Usar slug se disponível, senão usar o ID
        const identifier = company.slug || company.id;
        
        return (
          <Button variant="outline" key={company.id} value={company.id} asChild>
            <Link href={`/team/teams/${identifier}`}>{company.name}</Link>
          </Button>
        );
      })}
    </div>
  );
}
