"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import CompanyForm from "../components/form";

export const CompanyFormDialog = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  return (
    <Dialog open={mounted}>
      <form>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar empresa</DialogTitle>
            <DialogDescription>
              Adicione uma empresa para continuar.
            </DialogDescription>
          </DialogHeader>
          <CompanyForm />
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default CompanyFormDialog;