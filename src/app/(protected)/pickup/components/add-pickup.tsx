"use client";

import { useState } from "react";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ResponsiveAddButton } from "@/components/ui/responsive-add-button";

import UpsertPickupForm from "./upsert-pickup-form";

const AddPickupButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <ResponsiveAddButton
          desktopText="Adicionar captador"
          mobileText="Captador"
        />
      </DialogTrigger>
      <UpsertPickupForm onSuccess={() => setIsOpen(false)} isOpen={isOpen} />
    </Dialog>
  );
};

export default AddPickupButton;
