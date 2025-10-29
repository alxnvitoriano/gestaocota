-- Tornar CPF opcional na tabela clients
ALTER TABLE "clients" ALTER COLUMN "cpf" DROP NOT NULL;