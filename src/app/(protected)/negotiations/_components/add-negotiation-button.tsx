"use client";

import { useState } from "react";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ResponsiveAddButton } from "@/components/ui/responsive-add-button";
import { clientsTable, pickupTable, salespersonTable } from "@/db/schema";

import UpsertNegotiationForm from "./upsert-negotiation-form";

interface AddNegotiationButtonProps {
  clients: Pick<typeof clientsTable.$inferSelect, "id" | "name">[];
  sellers: Pick<typeof salespersonTable.$inferSelect, "id" | "name">[];
  pickups: Pick<typeof pickupTable.$inferSelect, "id" | "name">[];
}

const AddNegotiationButton = ({
  clients,
  sellers,
  pickups,
}: AddNegotiationButtonProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ResponsiveAddButton
          desktopText="Nova negociação"
          mobileText="Negociação"
        />
      </DialogTrigger>
      <UpsertNegotiationForm
        clients={clients}
        sellers={sellers}
        pickups={pickups}
        onSuccess={() => setOpen(false)}
      />
    </Dialog>
  );
};

export default AddNegotiationButton;
