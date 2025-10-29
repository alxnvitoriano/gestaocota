"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { SubmitHandler, useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { ClientSelect } from "@/components/ui/client-select";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  clientsTable,
  negociationsTable,
  pickupTable,
  salespersonTable,
} from "@/db/schema";

import { upsertNegotiationAction } from "../../actions/upsert-negociation";
import { upsertNegotiationSchema } from "../../actions/upsert-negociation/schema";

interface UpsertNegociationFormProps {
  clients: Pick<typeof clientsTable.$inferSelect, "id" | "name">[];
  sellers: Pick<typeof salespersonTable.$inferSelect, "id" | "name">[];
  pickups: Pick<typeof pickupTable.$inferSelect, "id" | "name">[];
  readOnly?: boolean;
  negociation?:
    | (Pick<
        typeof negociationsTable.$inferSelect,
        | "id"
        | "createdAt"
        | "updatedAt"
        | "companyId"
        | "clientId"
        | "salespersonId"
        | "negociationStatus"
        | "negociationResult"
        | "negociationValue"
        | "observation"
      > & {
        client?: {
          id: string;
          name: string;
          pickup?: { id: string; name: string } | null;
        } | null;
      })
    | undefined;
  onSuccess?: () => void;
}

const UpsertNegociationForm = ({
  onSuccess,
  clients,
  sellers,
  pickups,
  readOnly = false,
  negociation,
}: UpsertNegociationFormProps) => {
  type NegotiationStatus = z.infer<
    typeof upsertNegotiationSchema
  >["negociationStatus"];
  const statusValue = negociation?.negociationStatus;
  const defaultStatus: NegotiationStatus =
    statusValue === "pending" ||
    statusValue === "accepted" ||
    statusValue === "rejected"
      ? statusValue
      : "pending";

  const form = useForm<z.infer<typeof upsertNegotiationSchema>>({
    resolver: zodResolver(upsertNegotiationSchema),
    defaultValues: {
      id: negociation?.id || undefined,
      clientId: negociation?.clientId || "",
      salespersonId: negociation?.salespersonId || "",
      negociationStatus: defaultStatus,
      negociationResult: negociation?.negociationResult || undefined,
      negociationValue: negociation?.negociationValue || 0,
      administrator: undefined,
      observation: negociation?.observation || "",
      pickupId: negociation?.client?.pickup?.id || "",
    },
  });

  const { execute: upsertNegociation, isExecuting } = useAction(
    upsertNegotiationAction,
    {
      onSuccess: () => {
        toast.success(
          negociation
            ? "Negociação atualizada com sucesso!"
            : "Negociação criada com sucesso!",
        );
        form.reset();
        onSuccess?.();
      },
      onError: ({ error }) => {
        toast.error(
          error.serverError ||
            (negociation
              ? "Erro ao atualizar negociação"
              : "Erro ao criar negociação"),
        );
      },
    },
  );

  const onSubmit: SubmitHandler<z.infer<typeof upsertNegotiationSchema>> = (
    values,
  ) => {
    if (readOnly) return;
    upsertNegociation(values);
  };

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>
          {readOnly
            ? "Visualizar negociação"
            : negociation
              ? "Editar negociação"
              : "Criar nova negociação"}
        </DialogTitle>
        <DialogDescription>
          {readOnly
            ? "Detalhes da negociação. Campos desabilitados para edição."
            : negociation
              ? "Atualize os dados da negociação."
              : "Preencha os dados para criar uma nova negociação."}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <FormControl>
                    <ClientSelect
                      clients={clients}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Selecione um cliente"
                      disabled={readOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="salespersonId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vendedor</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full" disabled={readOnly}>
                        <SelectValue placeholder="Selecione um vendedor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sellers.map((seller) => (
                        <SelectItem key={seller.id} value={seller.id}>
                          {seller.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pickupId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Captador</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full" disabled={readOnly}>
                        <SelectValue placeholder="Selecione um captador" />
                      </SelectTrigger>
                      <SelectContent>
                        {pickups.map((pickup) => (
                          <SelectItem key={pickup.id} value={pickup.id}>
                            {pickup.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="negociationValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor da negociação</FormLabel>
                  <FormControl>
                    <NumericFormat
                      customInput={Input}
                      thousandSeparator="."
                      decimalSeparator=","
                      prefix="R$ "
                      decimalScale={2}
                      fixedDecimalScale
                      placeholder="R$ 0,00"
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value.floatValue || 0);
                      }}
                      disabled={readOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="negociationStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status da negociação</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(val) =>
                        field.onChange(val as NegotiationStatus)
                      }
                    >
                      <SelectTrigger className="w-full" disabled={readOnly}>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Cotação</SelectItem>
                        <SelectItem value="accepted">Documentação</SelectItem>
                        <SelectItem value="rejected">Reunião</SelectItem>
                        <SelectItem value="rejected">Vendeu</SelectItem>
                        <SelectItem value="rejected">
                          Não quer consorcio
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="negociationResult"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Negociação</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Veiculo"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      disabled={readOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="observation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observação</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Adicione observações"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      disabled={readOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="administrator"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Administradora</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full" disabled={readOnly}>
                        <SelectValue placeholder="Selecione uma administradora" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Evoy">Evoy</SelectItem>
                        <SelectItem value="Alpha">Alpha</SelectItem>
                        <SelectItem value="Reserva">Reserva</SelectItem>
                        <SelectItem value="Eutbem">Eutbem</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {!readOnly && (
            <DialogFooter>
              <Button type="submit" disabled={isExecuting}>
                {isExecuting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {negociation ? "Atualizar negociação" : "Criar negociação"}
              </Button>
            </DialogFooter>
          )}
        </form>
      </Form>
    </DialogContent>
  );
};

export default UpsertNegociationForm;
