import {
  Dialog,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import NewInvoiceForm from "../forms/NewInvoiceForm";

export default function ImportInvoice() {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [searchParams, setSearchParams] = useSearchParams();

  const isOpen = searchParams.get("invoice") === "1";
  function closeModal() {
    setSearchParams((state) => {
      state.delete("invoice");
      return state;
    });
  }

  return (
    <Dialog
      fullScreen={fullScreen}
      open={isOpen}
      onClose={closeModal}
      PaperProps={{
        style: { background: "#0d0d0d" },
      }}
    >
      <DialogTitle>Bulk import invoices</DialogTitle>
      <DialogContent>
        <NewInvoiceForm />
      </DialogContent>
    </Dialog>
  );
}
