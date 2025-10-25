import { z } from "zod";

export const searchNegotiationsSchema = z.object({
  companyId: z.string().uuid(),
  searchTerm: z.string().optional(),
});

export type SearchNegotiationsInput = z.infer<typeof searchNegotiationsSchema>;