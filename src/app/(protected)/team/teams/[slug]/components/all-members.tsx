"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { User } from "@/db/schema";
import { authClient } from "@/lib/auth-client";

interface AllMembersProps {
  users: User[];
  companyId: string;
}

export default function AllMembers({ users, companyId }: AllMembersProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInviteMember = async (user: User) => {
    try {
      setIsLoading(true);
      const { error } = await authClient.organization.inviteMember({
        email: user.email,
        role: "member",
        organizationId: companyId,
      });

      if (error) {
        toast.error("Erro ao convidar membro. Tente novamente.");
        console.error(error);
        return;
      }
      toast.success("Convite enviado com sucesso!");
      setIsLoading(false);
      router.refresh();
    } catch (error) {
      console.error("Erro ao convidar membro:", error);
      toast.error("Erro ao enviar convite. Tente novamente.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">Todos os Membros</h2>
      {users.map((user) => (
        <div key={user.id} className="flex items-center justify-between gap-2">
          {user.name}{" "}
          <Button onClick={() => handleInviteMember(user)} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Convide ao Time"
            )}
          </Button>
        </div>
      ))}
    </div>
  );
}
