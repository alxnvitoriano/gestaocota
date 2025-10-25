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
import { salespersonTable } from "@/db/schema";

const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
});

interface UpsertSellersProps {
  isOpen: boolean;
  seller?: typeof salespersonTable.$inferSelect;
  onSuccess?: () => void;
}

const UpsertSellersForm = ({
  isOpen,
  seller,
  onSuccess,
}: UpsertSellersProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: seller?.name || "",
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
    onError: () => {
      toast.error(
        seller?.id
          ? "Erro ao atualizar vendedor"
          : "Erro ao adicionar vendedor",
      );
    },
  });
  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: seller?.name || "",
      });
    }
  }, [isOpen, form, seller]);

  const onSubmit = (values: z.infer<typeof upsertSellerSchema>) => {
    upsertSellerAction.execute({
      ...values,
      id: seller?.id,
    });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Adicionar vendedor</DialogTitle>
        <DialogDescription>Adicione um novo vendedor</DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
