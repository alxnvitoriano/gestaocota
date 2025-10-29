import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { upsertSeller } from "@/app/actions/upsert-seller";
import { upsertSellerSchema } from "@/app/actions/upsert-seller/schema";
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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { pickupTable, salespersonTable } from "@/db/schema";

// Use shared schema for consistency
const formSchema = upsertSellerSchema;

interface UpsertSellersProps {
  isOpen: boolean;
  seller?: typeof salespersonTable.$inferSelect;
  pickups: Pick<typeof pickupTable.$inferSelect, "id" | "name">[];
  eligibleUsers?: { id: string; name: string; email: string }[];
  onSuccess?: () => void;
}

const UpsertSellersForm = ({
  isOpen,
  seller,
  pickups,
  eligibleUsers = [],
  onSuccess,
}: UpsertSellersProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: seller?.name || "",
      pickupId: seller?.pickupId || undefined,
      id: seller?.id || undefined,
      userId: "",
    },
  });

  const upsertSellerAction = useAction(upsertSeller, {
    onSuccess: () => {
      toast.success(
        seller?.id
          ? "Vendedor atualizado com sucesso"
          : "Vendedor adicionado com sucesso",
      );
      onSuccess?.();
    },
    onError: ({ error }) => {
      toast.error(
        error.serverError ||
          (seller?.id
            ? "Erro ao atualizar vendedor"
            : "Erro ao adicionar vendedor"),
      );
    },
  });
  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: seller?.name || "",
        pickupId: seller?.pickupId || undefined,
        id: seller?.id || undefined,
        userId: "",
      });
    }
  }, [isOpen, form, seller]);

  const onSubmit = (values: z.infer<typeof upsertSellerSchema>) => {
    upsertSellerAction.execute({
      ...values,
      id: seller?.id,
      // Converte strings vazias para undefined para passar na validação Zod
      pickupId: values.pickupId || undefined,
      userId: values.userId || undefined,
    });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {seller?.id ? "Editar vendedor" : "Adicionar vendedor"}
        </DialogTitle>
        <DialogDescription>
          {seller?.id
            ? "Atualize os dados do vendedor"
            : "Adicione um novo vendedor"}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            name="userId"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vendedor (membro com cargo salesperson)</FormLabel>
                <Select onValueChange={field.onChange} value={field.value ?? ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um membro vendedor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {eligibleUsers.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.name} ({u.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                <FormLabel>Captador (opcional)</FormLabel>
                <Select onValueChange={field.onChange} value={field.value ?? ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um captador" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {pickups.map((pickup) => (
                      <SelectItem key={pickup.id} value={pickup.id}>
                        {pickup.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button type="submit" disabled={upsertSellerAction.isPending}>
              {upsertSellerAction.isExecuting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : seller?.id ? (
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

export default UpsertSellersForm;
