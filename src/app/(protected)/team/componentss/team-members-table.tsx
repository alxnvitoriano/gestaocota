"use client";

import dayjs from "dayjs";

import { Badge } from "@/components/ui/badge";
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

const TeamMembersTable = ({ members }: TeamMembersTableProps) => {
  if (members.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
        <p className="text-muted-foreground">Nenhum membro encontrado.</p>
      </div>
    );
  }

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
                <Badge>{getRoleTranslation(member.role)}</Badge>
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
