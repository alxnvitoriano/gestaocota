import { createSafeActionClient } from "next-safe-action";

export const actionClient = createSafeActionClient({
  handleServerError(e) {
    // Retorna a mensagem de erro original para o cliente
    return e.message;
  },
});
