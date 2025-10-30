"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
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
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  clientsTable,
  negociationsTable,
  pickupTable,
  salespersonTable,
} from "@/db/schema";

import { upsertNegotiationAction } from "../../actions/upsert-negociation";
import { upsertNegotiationSchema } from "../../actions/upsert-negociation/schema";

interface UpsertNegociationFormProps {
  clients: Pick<typeof clientsTable.$inferSelect, "id" | "name" | "desire">[];
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
        | "credit"
        | "observation"
      > & {
        client?: {
          id: string;
          name: string;
          desire?: string | null;
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
    statusValue === "cotacion" ||
    statusValue === "Called" ||
    statusValue === "documentation" ||
    statusValue === "meeting" ||
    statusValue === "sold" ||
    statusValue === "notInterested" ||
    statusValue === "notCalled"
      ? statusValue
      : "pending";

  const form = useForm<z.infer<typeof upsertNegotiationSchema>>({
    resolver: zodResolver(upsertNegotiationSchema),
    defaultValues: {
      id: negociation?.id || undefined,
      clientId: negociation?.clientId || "",
      salespersonId: negociation?.salespersonId || "",
      negociationStatus: defaultStatus,
      negociationResult:
        negociation?.client?.desire ??
        negociation?.negociationResult ??
        undefined,
      credit: negociation?.credit || 0,
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

  const onSubmit = (values: z.infer<typeof upsertNegotiationSchema>) => {
    if (readOnly) return;
    upsertNegociation(values);
  };

  // Auto-preencher "Veículo" (negociationResult) com o desejo do cliente
  const selectedClientId = useWatch({
    control: form.control,
    name: "clientId",
  });
  const selectedClient = clients.find((c) => c.id === selectedClientId);
  const desiredVehicle = selectedClient?.desire ?? undefined;

  // Sincroniza o valor do desejo do cliente no campo negociationResult
  // sempre que o cliente selecionado mudar
  useEffect(() => {
    form.setValue("negociationResult", desiredVehicle);
  }, [form, selectedClientId, desiredVehicle]);

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
                  <FormControl>
                    <SearchableSelect
                      items={sellers}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Selecione um vendedor"
                      disabled={readOnly}
                    />
                  </FormControl>
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
                    <SearchableSelect
                      items={pickups}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Selecione um captador"
                      disabled={readOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="credit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Crédito</FormLabel>
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
                  <Select
                    value={field.value}
                    onValueChange={(val) =>
                      field.onChange(val as NegotiationStatus)
                    }
                  >
                    <FormControl>
                      <SelectTrigger className="w-full" disabled={readOnly}>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="cotacion">Cotação</SelectItem>
                      <SelectItem value="documentation">
                        Documentação
                      </SelectItem>
                      <SelectItem value="meeting">Reunião</SelectItem>
                      <SelectItem value="sold">Vendeu</SelectItem>
                      <SelectItem value="notInterested">Desistiu</SelectItem>
                      <SelectItem value="notCalled">Não ligou</SelectItem>
                      <SelectItem value="Called">Ligou</SelectItem>
                      <SelectItem value="inNegociation">
                        Em negociação
                      </SelectItem>
                    </SelectContent>
                  </Select>
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
                  <FormLabel>Veículo (desejo)</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Veículo do lead"
                      value={field.value || ""}
                      readOnly
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
                    <Textarea
                      rows={4}
                      placeholder="Adicione observações"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      readOnly={readOnly}
                      className="min-h-24 wrap-break-word whitespace-pre-wrap"
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
                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full" disabled={readOnly}>
                        <SelectValue placeholder="Selecione uma administradora" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Evoy">Evoy</SelectItem>
                      <SelectItem value="Alpha">Alpha</SelectItem>
                      <SelectItem value="Reserva">Reserva</SelectItem>
                      <SelectItem value="Eutbem">Eutbem</SelectItem>
                    </SelectContent>
                  </Select>
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
