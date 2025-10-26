"use client";

import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { updateMemberRole } from "@/app/actions/members/update-member-role";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Role } from "@/db/schema";

interface TeamMember {
  id: string;
  role: Role;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

interface TeamMembersTableProps {
  members: TeamMember[];
  companyId: string;
  canEditRoles: boolean;
}

const getRoleTranslation = (role: Role): string => {
  const translations: Record<Role, string> = {
    member: "Membro",
    salesperson: "Vendedor",
    pickup: "Captador",
    general_manager: "Gerente Geral",
    team_manager: "Gerente de Equipe",
  };
  return translations[role];
};

const TeamMembersTable = ({
  members,
  companyId,
  canEditRoles,
}: TeamMembersTableProps) => {
  const router = useRouter();

  if (members.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
        <p className="text-muted-foreground">Nenhum membro encontrado.</p>
      </div>
    );
  }

  const handleChangeRole = async (memberId: string, newRole: Role) => {
    const result = await updateMemberRole(memberId, companyId, newRole);
    if (result.success) {
      toast.success(result.message || "Cargo atualizado com sucesso!");
      router.refresh();
    } else {
      toast.error(result.error || "Falha ao atualizar cargo.");
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Função</TableHead>
            <TableHead>Data de Entrada</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="font-medium">
                {member.user.name || "Nome não informado"}
              </TableCell>
              <TableCell>{member.user.email}</TableCell>
              <TableCell>
                {canEditRoles ? (
                  <Select
                    defaultValue={member.role}
                    onValueChange={(value) =>
                      handleChangeRole(member.id, value as Role)
                    }
                  >
                    <SelectTrigger className="min-w-[220px]">
                      <SelectValue placeholder="Selecione um cargo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">
                        {getRoleTranslation("member")}
                      </SelectItem>
                      <SelectItem value="salesperson">
                        {getRoleTranslation("salesperson")}
                      </SelectItem>
                      <SelectItem value="pickup">
                        {getRoleTranslation("pickup")}
                      </SelectItem>
                      <SelectItem value="team_manager">
                        {getRoleTranslation("team_manager")}
                      </SelectItem>
                      <SelectItem value="general_manager">
                        {getRoleTranslation("general_manager")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge>{getRoleTranslation(member.role)}</Badge>
                )}
              </TableCell>
              <TableCell>
                {dayjs(member.createdAt).format("DD/MM/YYYY")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TeamMembersTable;
