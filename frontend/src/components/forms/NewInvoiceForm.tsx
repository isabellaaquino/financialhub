import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextField } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { Controller, useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import dateService from "../../api/services/DateService";
import invoiceService from "../../api/services/InvoiceService";
import { useAuth } from "../../hooks/useAuth";
import { BankInstitutions } from "../../models/Invoices";
import {
  NewInvoiceImportFormData,
  newInvoiceImportSchema,
} from "../../schemas/invoiceImportSchema";

function NewTransactionForm() {
  const queryClient = useQueryClient();
  const { authTokens } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [_, setSearchParams] = useSearchParams();
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<NewInvoiceImportFormData>({
    resolver: zodResolver(newInvoiceImportSchema),
    defaultValues: {
      invoices: undefined,
    },
  });

  const { mutateAsync } = useMutation({
    mutationFn: invoiceService.sendPDFFile,
    onSuccess: () => {
      setSearchParams((state) => {
        state.delete("invoice");
        return state;
      });
      queryClient.invalidateQueries({
        queryKey: [
          "transactions",
          authTokens!.access,
          dateService.currentYear(),
        ],
      });
      queryClient.invalidateQueries({
        queryKey: ["wallet", authTokens!.access],
      });
      enqueueSnackbar("Transactions imported successfully!", {
        variant: "success",
        autoHideDuration: 3000,
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });
    },
    onError: (err) => {
      console.log(err);
      enqueueSnackbar("No server response", {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });
    },
  });

  async function importFiles(data: NewInvoiceImportFormData) {
    console.log("chegou");
    await mutateAsync({
      accessToken: authTokens!.access,
      files: data.invoices,
      institution: BankInstitutions.SANTANDER,
    });
  }

  return (
    <form
      onSubmit={handleSubmit(importFiles)}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        width: "500px",
        marginTop: 20,
      }}
    >
      <Controller
        name="invoices"
        control={control}
        render={() => (
          <TextField
            fullWidth
            autoFocus
            type="file"
            helperText={errors.invoices?.message}
            error={!!errors.invoices}
            onChange={(e: any) => {
              setValue("invoices", e.target.files);
            }}
            size="small"
            inputProps={{ multiple: true }}
          />
        )}
      />

      <Button type="submit" variant="contained">
        Import
      </Button>
    </form>
  );
}

export default NewTransactionForm;
