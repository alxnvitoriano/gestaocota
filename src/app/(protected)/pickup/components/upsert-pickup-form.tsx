import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { upsertPickup } from "@/app/actions/upsert-pickup";
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
import { pickupTable } from "@/db/schema";

const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  userId: z.string().optional(),
});

interface UpsertPickupProps {
  isOpen: boolean;
  pickup?: typeof pickupTable.$inferSelect;
  onSuccess?: () => void;
  eligibleUsers?: { id: string; name: string; email: string }[];
}

const UpsertPickupForm = ({
  isOpen,
  pickup,
  onSuccess,
  eligibleUsers = [],
}: UpsertPickupProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: pickup?.name || "",
      userId: pickup?.userId || undefined,
    },
  });

  const upsertPickupAction = useAction(upsertPickup, {
    onSuccess: () => {
      toast.success(
        pickup?.id
          ? "Captador atualizado com sucesso"
          : "Captador adicionado com sucesso",
      );
      onSuccess?.();
    },
    onError: () => {
      toast.error(
        pickup?.id
          ? "Erro ao atualizar captador"
          : "Erro ao adicionar captador",
      );
    },
  });
  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: pickup?.name || "",
        userId: pickup?.userId || undefined,
      });
    }
  }, [isOpen, form, pickup]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    upsertPickupAction.execute({
      ...values,
      id: pickup?.id,
    });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Adicionar captador</DialogTitle>
        <DialogDescription>Adicione um novo captador</DialogDescription>
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

          {!pickup?.id && (
            <FormField
              name="userId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuario Captador</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o usuário" />
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
          )}

          <DialogFooter>
            <Button type="submit" disabled={upsertPickupAction.isPending}>
              {upsertPickupAction.isExecuting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : pickup?.id ? (
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

export default UpsertPickupForm;
