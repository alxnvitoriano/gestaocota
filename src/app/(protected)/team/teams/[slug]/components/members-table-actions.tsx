"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { removeMember } from "@/app/actions/members/remove-member";
import { Button } from "@/components/ui/button";

export default function MembersTableActions({
  memberId,
  companyId,
  canRemove,
}: {
  memberId: string;
  companyId: string;
  canRemove: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRemoveMember = async () => {
    try {
      setIsLoading(true);
      const result = await removeMember(memberId, companyId);

      if (result.success) {
        toast.success(result.message || "Membro removido com sucesso!");
        router.refresh();
      } else {
        toast.error(result.error || "Erro ao remover membro.");
      }
    } catch (error) {
      toast.error("Erro ao remover membro.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Só mostrar o botão se o usuário tem permissão
  if (!canRemove) {
    return null;
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleRemoveMember}
      disabled={isLoading}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Remover"}
    </Button>
  );
}
