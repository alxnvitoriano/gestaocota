"use client";

import { useState } from "react";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ResponsiveAddButton } from "@/components/ui/responsive-add-button";

import UpsertSellersForm from "./upsert-sellers-form";

const AddSellersButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <ResponsiveAddButton
          desktopText="Adicionar vendedor"
          mobileText="Vendedor"
        />
      </DialogTrigger>
      <UpsertSellersForm onSuccess={() => setIsOpen(false)} isOpen={isOpen} />
    </Dialog>
  );
};

export default AddSellersButton;
