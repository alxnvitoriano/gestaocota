"use client";

import { useState } from "react";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ResponsiveAddButton } from "@/components/ui/responsive-add-button";

// import { ResponsiveAddButton } from "@/components/ui/responsive-add-button";
import UpsertClientForm from "./upsert-client-form";

const AddClientButton = () => {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ResponsiveAddButton
          desktopText="Adicionar cliente"
          mobileText="Cliente"
        />
      </DialogTrigger>
      <UpsertClientForm onSuccess={handleSuccess} isOpen={open} />
    </Dialog>
  );
};

export default AddClientButton;
