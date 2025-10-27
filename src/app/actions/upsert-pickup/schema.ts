import { z } from "zod";

export const upsertPickupSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1, "Nome é obrigatório"),
  // userId vem da tabela usersTable e é uma string (não UUID)
  userId: z.string().trim().optional(),
});

export type UpsertPickupSchema = z.infer<typeof upsertPickupSchema>;
