"use client";

import { EditIcon, EyeIcon, MoreVerticalIcon, TrashIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";

import { deleteNegotiationAction } from "@/app/(protected)/actions/delete-negociation";
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
import { negociationsTable, pickupTable } from "@/db/schema";

import UpsertNegotiationForm from "./upsert-negotiation-form";

type SimpleClient = {
  id: string;
  name: string;
};

type SimpleSeller = {
  id: string;
  name: string;
};

type SimplePickup = Pick<typeof pickupTable.$inferSelect, "id" | "name">;

type NegociationWithRelations = typeof negociationsTable.$inferSelect & {
  client: {
    id: string;
    name: string;
    pickup?: { id: string; name: string } | null;
  } | null;
  salesperson: { id: string; name: string } | null;
};

interface NegociationsTableActionsProps {
  negotiation: NegociationWithRelations;
  clients: SimpleClient[];
  sellers: SimpleSeller[];
  pickups: SimplePickup[];
  readOnly?: boolean;
}

export const NegociationsTableActions = ({
  negotiation,
  clients,
  sellers,
  pickups,
  readOnly = false,
}: NegociationsTableActionsProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { execute: deleteNegotiation, isExecuting } = useAction(
    deleteNegotiationAction,
    {
      onSuccess: () => {
        toast.success("Negociação excluída com sucesso!");
        setIsDeleteDialogOpen(false);
      },
      onError: () => {
        toast.error("Erro ao excluir negociação. Tente novamente.");
      },
    },
  );

  const handleDelete = () => {
    deleteNegotiation({ id: negotiation.id });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVerticalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>
            {negotiation.client?.name || "Negociação"}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {readOnly ? (
            <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
              <EyeIcon className="mr-2 h-4 w-4" />
              Visualizar
            </DropdownMenuItem>
          ) : (
            <>
              <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                <EditIcon className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setIsDeleteDialogOpen(true)}
                className="text-destructive focus:text-destructive"
              >
                <TrashIcon className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta negociação com{" "}
              <strong>{negotiation.client?.name}</strong>? Esta ação não pode
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isExecuting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isExecuting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <UpsertNegotiationForm
          negociation={negotiation}
          clients={clients}
          sellers={sellers}
          pickups={pickups}
          readOnly={readOnly}
          onSuccess={() => setIsEditDialogOpen(false)}
        />
      </Dialog>
    </>
  );
};
