"use client";

import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

import { deletePickup } from "@/app/actions/delete-pickup";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { pickupTable } from "@/db/schema";

import UpsertPickupForm from "./upsert-pickup-form";

interface PickupCardProps {
  pickup: typeof pickupTable.$inferSelect;
}

const PickupCard = ({ pickup }: PickupCardProps) => {
  const pickupInitials = pickup.name
    .split(" ")
    .map((name) => name[0])
    .join("");

  const deletePickupAction = useAction(deletePickup, {
    onSuccess: () => {
      toast.success("Captador excluído com sucesso");
    },
    onError: () => {
      toast.error("Erro ao excluir captador");
    },
  });

  const handleDeletePickupClick = () => {
    if (!pickup) return;
    deletePickupAction.execute({
      id: pickup.id,
    });
  };
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex flex-col items-center gap-2 sm:gap-3">
          <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
            <AvatarFallback className="text-xs sm:text-sm">
              {pickupInitials}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h3 className="text-xs font-medium sm:text-sm">{pickup.name}</h3>
          </div>
        </div>
      </CardHeader>
      <CardFooter className="flex flex-col gap-2 pt-0">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full text-xs sm:text-sm" size="sm">
              Ver detalhes
            </Button>
          </DialogTrigger>
          <UpsertPickupForm
            pickup={{ ...pickup, avatarImageUrl: null }}
            isOpen={true}
          />
        </Dialog>
        {pickup && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full text-xs sm:text-sm"
                size="sm"
              >
                Excluir
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Tem certeza que deseja excluir este vendedor?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Isso excluirá permanentemente
                  este vendedor e seus agendamentos.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeletePickupClick}>
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardFooter>
    </Card>
  );
};

export default PickupCard;
