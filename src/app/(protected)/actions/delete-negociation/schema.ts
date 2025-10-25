import { z } from "zod";

export const deleteNegotiationSchema = z.object({
  id: z.string().uuid("ID da negociação é obrigatório"),
});

export type DeleteNegotiationSchema = z.infer<typeof deleteNegotiationSchema>;
