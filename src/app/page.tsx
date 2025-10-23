import Link from "next/link";

import { Button } from "@/components/ui/button";

const initalPage = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-3xl font-bold">
        Bem vindo ao Gestão Cotas, seu CRM de Gestão de Clientes
      </h1>
      <Button asChild>
        <Link href="/authentication">Acessar</Link>
      </Button>
    </div>
  );
};

export default initalPage;
