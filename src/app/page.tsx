import Link from "next/link";

import { Button } from "@/components/ui/button";

const initalPage = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-4">
      <h1 className="mb-6 text-center text-2xl font-bold sm:text-3xl">
        Bem vindo ao Gestão Cotas, seu CRM de Gestão de Clientes
      </h1>
      <Button asChild className="w-full sm:w-auto">
        <Link href="/authentication">Acessar</Link>
      </Button>
    </div>
  );
};

export default initalPage;
