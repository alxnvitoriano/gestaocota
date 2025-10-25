import { z } from "zod";

export const upsertPickupSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1, "Nome é obrigatório"),
});

export type UpsertPickupSchema = z.infer<typeof upsertPickupSchema>;
