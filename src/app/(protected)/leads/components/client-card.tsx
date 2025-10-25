"use client";

import { useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { clientsTable } from "@/db/schema";

import UpsertClientForm from "./upsert-client-form";

interface ClientCardProps {
  client: typeof clientsTable.$inferSelect;
}

const ClientCard = ({ client }: ClientCardProps) => {
  const [open, setOpen] = useState(false);

  const clientInitials = client.name
    .split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2);

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Avatar className="h-12 w-12">
            <AvatarFallback>{clientInitials}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h3 className="text-sm font-medium">{client.name}</h3>
            <p className="text-muted-foreground text-xs">{client.cpf}</p>
          </div>
        </div>
        <Separator />
        <CardContent className="flex flex-col gap-1">
          <p className="text-sm font-medium">
            Desejo: <Badge variant="outline">{client.desire}</Badge>
          </p>
          <p className="text-sm font-medium">
            Valor da Entrada:{" "}
            <Badge variant="outline">
              {(client.entrance ?? 0 / 100).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </Badge>
          </p>
        </CardContent>
      </CardHeader>
      <CardFooter>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">Ver detalhes</Button>
          </DialogTrigger>
          <UpsertClientForm
            client={client}
            onSuccess={handleSuccess}
            isOpen={open}
          />
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default ClientCard;
