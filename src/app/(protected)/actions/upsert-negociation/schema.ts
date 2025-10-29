import { z } from "zod";

export const upsertNegotiationSchema = z.object({
  id: z.string().uuid().optional(), // Para edição
  clientId: z.string().uuid("Cliente é obrigatório"),
  salespersonId: z.string().uuid("Vendedor é obrigatório"),
  negociationStatus: z.enum([
    "pending",
    "cotacion",
    "Called",
    "documentation",
    "meeting",
    "sold",
    "notInterested",
    "notCalled",
  ]),
  negociationValue: z
    .number()
    .min(0, "Valor da negociação deve ser maior ou igual a zero")
    .optional(),
  negociationResult: z.string().optional(),
  administrator: z.enum(["Evoy", "Alpha", "Reserva", "Eutbem"]).optional(),
  observation: z.string().optional(),
  pickupId: z.string().uuid().optional(),
  credit: z
    .number()
    .int()
    .min(0, "Crédito deve ser maior ou igual a zero")
    .optional(),
});

export type UpsertNegotiationSchema = z.infer<typeof upsertNegotiationSchema>;
