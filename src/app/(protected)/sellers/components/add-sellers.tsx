"use client";

import { useState } from "react";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ResponsiveAddButton } from "@/components/ui/responsive-add-button";
import { pickupTable } from "@/db/schema";

import UpsertSellersForm from "./upsert-sellers-form";

interface AddSellersButtonProps {
  pickups: Pick<typeof pickupTable.$inferSelect, "id" | "name">[];
  eligibleUsers: { id: string; name: string; email: string }[];
}

const AddSellersButton = ({ pickups, eligibleUsers }: AddSellersButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <ResponsiveAddButton
          desktopText="Adicionar vendedor"
          mobileText="Vendedor"
        />
      </DialogTrigger>
      <UpsertSellersForm
        onSuccess={() => setIsOpen(false)}
        isOpen={isOpen}
        pickups={pickups}
        eligibleUsers={eligibleUsers}
      />
    </Dialog>
  );
};

export default AddSellersButton;
