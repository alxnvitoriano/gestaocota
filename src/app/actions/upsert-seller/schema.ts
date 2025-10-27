import { z } from "zod";

export const upsertSellerSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1, "Nome é obrigatório"),
  pickupId: z.string().uuid().optional(),
  // usersTable.id é do tipo text, portanto não é UUID
  userId: z.string().trim().optional(),
});

export type UpsertSellerSchema = z.infer<typeof upsertSellerSchema>;
