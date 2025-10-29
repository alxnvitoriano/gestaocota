import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Member } from "@/db/schema";

import MembersTableActions from "./members-table-actions";

interface MembersTableProps {
  members: Member[];
  companyId: string;
}

export default function MembersTable({ members, companyId }: MembersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Permissão</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => (
          <TableRow key={member.id}>
            <TableCell>{member.user?.name}</TableCell>
            <TableCell>{member.user?.email}</TableCell>
            <TableCell>{member.role}</TableCell>
            <TableCell className="text-right">
              <MembersTableActions memberId={member.id} companyId={companyId} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
