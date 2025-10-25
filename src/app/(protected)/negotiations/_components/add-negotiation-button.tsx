"use client";

import { useState } from "react";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ResponsiveAddButton } from "@/components/ui/responsive-add-button";
import { clientsTable, salespersonTable } from "@/db/schema";

import UpsertNegotiationForm from "./upsert-negotiation-form";

interface AddNegotiationButtonProps {
  clients: Pick<typeof clientsTable.$inferSelect, "id" | "name">[];
  sellers: Pick<typeof salespersonTable.$inferSelect, "id" | "name">[];
}

const AddNegotiationButton = ({
  clients,
  sellers,
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
        onSuccess={() => setOpen(false)}
      />
    </Dialog>
  );
};

export default AddNegotiationButton;
