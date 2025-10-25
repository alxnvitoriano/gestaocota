"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { removeMember } from "@/app/actions/members/remove-member";
import { checkUserCanRemoveMembers } from "@/app/actions/permissions/check-user-permission";
import { Button } from "@/components/ui/button";

export default function MembersTableActions({
  memberId,
  companyId,
}: {
  memberId: string;
  companyId: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [canRemove, setCanRemove] = useState(false);
  const [isCheckingPermissions, setIsCheckingPermissions] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const hasPermission = await checkUserCanRemoveMembers(companyId);
        setCanRemove(hasPermission);
      } catch (error) {
        console.error("Erro ao verificar permissões:", error);
        setCanRemove(false);
      } finally {
        setIsCheckingPermissions(false);
      }
    };

    checkPermissions();
  }, [companyId]);

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

  // Não mostrar nada enquanto verifica permissões
  if (isCheckingPermissions) {
    return null;
  }

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
