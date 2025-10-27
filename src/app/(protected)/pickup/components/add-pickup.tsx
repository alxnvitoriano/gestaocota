"use client";

import { useState } from "react";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ResponsiveAddButton } from "@/components/ui/responsive-add-button";

import UpsertPickupForm from "./upsert-pickup-form";

type EligibleUser = { id: string; name: string; email: string };

interface AddPickupButtonProps {
  eligibleUsers: EligibleUser[];
}

const AddPickupButton = ({ eligibleUsers }: AddPickupButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <ResponsiveAddButton
          desktopText="Adicionar captador"
          mobileText="Captador"
        />
      </DialogTrigger>
      <UpsertPickupForm
        onSuccess={() => setIsOpen(false)}
        isOpen={isOpen}
        eligibleUsers={eligibleUsers}
      />
    </Dialog>
  );
};

export default AddPickupButton;
