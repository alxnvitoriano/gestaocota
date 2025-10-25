import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import CompanyForm from "./components/form";

const CompanyFormPage = () => {
  return (
    <div>
      <Dialog open={true}>
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
    </div>
  );
};

export default CompanyFormPage;
