"use client";

import { EditIcon, MoreVerticalIcon, TrashIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";

import { deleteClient } from "@/app/actions/delete-client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { clientsTable, pickupTable } from "@/db/schema";

import UpsertClientForm from "./upsert-client-form";

interface ClientsTableActionsProps {
  client: typeof clientsTable.$inferSelect;
  pickups: Pick<typeof pickupTable.$inferSelect, "id" | "name">[];
}

const ClientsTableActions = ({ client, pickups }: ClientsTableActionsProps) => {
  const [upsertDialogIsOpen, setUpsertDialogIsOpen] = useState(false);
  const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false);
  const deleteClientAction = useAction(deleteClient, {
    onSuccess: () => {
      toast.success("Cliente excluído com sucesso");
      setDeleteDialogIsOpen(false);
    },
    onError: () => {
      toast.error("Erro ao excluir cliente");
    },
  });
  return (
    <Dialog open={upsertDialogIsOpen} onOpenChange={setUpsertDialogIsOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVerticalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{client.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setUpsertDialogIsOpen(true)}>
            <EditIcon className="h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDeleteDialogIsOpen(true)}>
            <TrashIcon className="h-4 w-4" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <UpsertClientForm
        isOpen={upsertDialogIsOpen}
        client={client}
        pickups={pickups}
        onSuccess={() => setUpsertDialogIsOpen(false)}
      />
      {/* Confirmar exclusão */}
      <AlertDialog
        open={deleteDialogIsOpen}
        onOpenChange={setDeleteDialogIsOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir cliente</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. Confirma a exclusão de{" "}
              {client.name}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => deleteClientAction.execute({ id: client.id })}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
};

export default ClientsTableActions;
