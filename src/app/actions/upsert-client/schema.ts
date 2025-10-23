import { z } from "zod";

const propertyTypes = ["imovel", "veiculo"] as const;
const maritalStatusTypes = [
  "solteiro",
  "casado",
  "uniao_estavel",
  "amasiado",
] as const;

export const upsertClientSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1, "Nome é obrigatório"),
  cpf: z
    .string()
    .trim()
    .min(11, "CPF é obrigatório")
    .max(11)
    .regex(/^\d{11}$/, "CPF inválido"),
  birthDate: z.string().min(1, "Data de nascimento é obrigatória"),
  propertyType: z.enum(propertyTypes, {
    message: "Tipo de bem é obrigatório",
  }),
  propertyLocation: z.string().trim().min(1, "Local do bem é obrigatório"),
  searchTimeMonths: z.number().min(1, "Tempo de busca deve ser maior que 0"),
  propertyValue: z.number().int().min(1, "Valor do bem é obrigatório"),
  desiredInstallment: z
    .number()
    .int()
    .min(1, "Parcela pretendida é obrigatória"),
  downPaymentCash: z
    .number()
    .int()
    .min(0, "Valor da entrada em espécie deve ser maior ou igual a zero"),
  downPaymentFgts: z
    .number()
    .int()
    .min(0, "Valor da entrada FGTS deve ser maior ou igual a zero"),
  maritalStatus: z.enum(maritalStatusTypes, {
    message: "Estado civil é obrigatório",
  }),
  profession: z.string().trim().min(1, "Profissão é obrigatória"),
  income: z.number().int().min(1, "Renda é obrigatória"),
  hasRestrictions: z.boolean(),
  hasFinanced: z.boolean(),
  purchaseReason: z.string().trim().min(1, "Motivo da compra é obrigatório"),
});

export type UpsertClientSchema = z.infer<typeof upsertClientSchema>;
