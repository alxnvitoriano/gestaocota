"use client";

import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Company } from "@/db/schema";
import { authClient } from "@/lib/auth-client";

interface CompanyChangeProps {
  companies: Company[];
}

export function CompanyChange({ companies }: CompanyChangeProps) {
  const handleChangeCompany = async (companyId: string) => {
    try {
      const { error } = await authClient.organization.setActive({
        organizationId: companyId,
      });
      if (error) {
        toast.error("Falha ao alterar empresa");
        return;
      }
      toast.success("Empresa alterada com sucesso!");
    } catch {
      toast.error("Erro ao alterar a empresa.");
    }
  };

  return (
    <div className="grid-cols grid gap-4">
      <Select onValueChange={handleChangeCompany} value={companies[0].id}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione uma empresa" />
        </SelectTrigger>
        <SelectContent>
          {companies.map((company: Company) => (
            <SelectItem key={company.id} value={company.id}>
              {company.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
