import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextField } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { Controller, useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { useInvoice } from "../../hooks/api/useInvoice";
import { BankInstitutions } from "../../models/Invoices";
import {
  NewInvoiceImportFormData,
  newInvoiceImportSchema,
} from "../../schemas/invoiceImportSchema";

function NewTransactionForm() {
  const queryClient = useQueryClient();
  const { uploadInvoice } = useInvoice();
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
      institution: BankInstitutions.SANTANDER,
    },
  });

  const { mutateAsync } = useMutation({
    mutationFn: uploadInvoice,
    onSuccess: () => {
      setSearchParams((state) => {
        state.delete("invoice");
        return state;
      });
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
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
      invoices: data.invoices,
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

      <Controller
        name="institution"
        control={control}
        render={({ field: { onChange } }) => (
          <TextField
            fullWidth
            autoFocus
            helperText={errors.institution?.message}
            error={!!errors.institution}
            onChange={onChange}
            size="small"
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
