import { z } from "zod";

export const upsertClientSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1, "Nome é obrigatório"),
  annuncio: z.string().trim().min(1, "Anúncio é obrigatório"),
  indication: z.string().trim().min(1, "Indicação é obrigatória"),
  desire: z.string().trim().min(1, "Desire é obrigatório"),
  phone: z.string().trim().min(11, "Telefone é obrigatório"),
  entranceValue: z
    .number()
    .int()
    .min(0, "Valor da entrada em espécie deve ser maior ou igual a zero"),
  pickupId: z.string().uuid().optional(),
  salespersonId: z.string().uuid().optional(),
});

export type UpsertClientSchema = z.infer<typeof upsertClientSchema>;
