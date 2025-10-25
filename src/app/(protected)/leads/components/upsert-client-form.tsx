"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { NumericFormat, PatternFormat } from "react-number-format";
import { toast } from "sonner";
import { z } from "zod";

import { upsertClient } from "@/app/actions/upsert-client";
import { upsertClientSchema } from "@/app/actions/upsert-client/schema";
import { Button } from "@/components/ui/button";
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
import { clientsTable, pickupTable } from "@/db/schema";

interface UpsertClientFormProps {
  isOpen: boolean;
  client?: typeof clientsTable.$inferSelect;
  pickups: Pick<typeof pickupTable.$inferSelect, "id" | "name">[];
  onSuccess?: () => void;
}

const UpsertClientForm = ({
  client,
  pickups,
  onSuccess,
  isOpen,
}: UpsertClientFormProps) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof upsertClientSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(upsertClientSchema),
    defaultValues: {
      name: client?.name || "",
      indication: client?.indication || "",
      annuncio: client?.annuncio || "",
      desire: client?.desire || "",
      entranceValue: client?.entrance ? client.entrance / 100 : 0,
      phone: client?.phone || "",
      pickupId: client?.pickupId || (pickups[0]?.id ?? undefined),
    },
  });
  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: client?.name || "",
        indication: client?.indication || "",
        annuncio: client?.annuncio || "",
        desire: client?.desire || "",
        entranceValue: client?.entrance ? client.entrance / 100 : 0,
        phone: client?.phone || "",
        pickupId: client?.pickupId || (pickups[0]?.id ?? undefined),
      });
    }
  }, [isOpen, form, client, pickups]);

  const upsertClientAction = useAction(upsertClient, {
    onSuccess: () => {
      toast.success(
        client?.id
          ? "Cliente atualizado com sucesso"
          : "Cliente adicionado com sucesso",
      );
      router.refresh();
      onSuccess?.();
    },
    onError: () => {
      toast.error(
        client?.id ? "Erro ao atualizar cliente" : "Erro ao adicionar cliente",
      );
    },
  });

  const onSubmit = (values: z.infer<typeof upsertClientSchema>) => {
    upsertClientAction.execute({
      ...values,
      id: client?.id,
      name: values.name,
      entranceValue: values.entranceValue * 100,
      desire: values.desire,
      annuncio: values.annuncio,
      indication: values.indication,
      cpf: values.cpf,
      phone: values.phone,
    });
  };

  return (
    <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {client?.id ? "Editar cliente" : "Adicionar cliente"}
        </DialogTitle>
        <DialogDescription>
          {client?.id
            ? "Edite as informações do cliente"
            : "Adicione um novo cliente"}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do cliente</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Digite o nome completo" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="cpf"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF</FormLabel>
                  <FormControl>
                    <PatternFormat
                      customInput={Input}
                      format="###.###.###-##"
                      mask="_"
                      placeholder="000.000.000-00"
                      value={field.value ?? ""}
                      onValueChange={(value) => {
                        field.onChange(value.value);
                      }}
                      onBlur={field.onBlur}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="phone"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <PatternFormat
                      customInput={Input}
                      format="(##) #####-####"
                      mask="_"
                      placeholder="(00) 00000-0000"
                      value={field.value ?? ""}
                      onValueChange={(value) => {
                        field.onChange(value.value);
                      }}
                      onBlur={field.onBlur}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="indication"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Indicação</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Indicação" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="annuncio"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Anúncio</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Anúncio" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="desire"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Desejo</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Desejo do cliente..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="entranceValue"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entrada (R$)</FormLabel>
                  <FormControl>
                    <NumericFormat
                      customInput={Input}
                      thousandSeparator="."
                      decimalSeparator="," 
                      allowNegative={false}
                      decimalScale={2}
                      fixedDecimalScale
                      placeholder="0,00"
                      value={field.value ?? 0}
                      onValueChange={(values) => {
                        const raw = Number(values.value || 0);
                        field.onChange(raw);
                      }}
                      onBlur={field.onBlur}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="pickupId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Captador</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um captador" />
                      </SelectTrigger>
                      <SelectContent>
                        {pickups.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name}
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
          <DialogFooter>
            <Button type="submit" disabled={upsertClientAction.isPending}>
              {upsertClientAction.isExecuting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : client?.id ? (
                "Atualizar"
              ) : (
                "Adicionar"
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default UpsertClientForm;
