import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import { schema } from "./schema";

// Usa driver HTTP serverless do Neon, ideal para Vercel
// Requer que DATABASE_URL esteja configurada (inclua ?sslmode=require quando necessário)
const sql = neon(process.env.DATABASE_URL as string);

export const db = drizzle(sql, { schema });
