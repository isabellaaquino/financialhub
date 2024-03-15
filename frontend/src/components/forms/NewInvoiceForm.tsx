import { zodResolver } from "@hookform/resolvers/zod";
import { HelpOutlineRounded } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { Controller, useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { TypeOption } from "../../enums/Enums";
import { useInvoice } from "../../hooks/api/useInvoice";
import { BankInstitutions } from "../../models/Invoices";
import { typeOptionMask } from "../../models/Transaction";
import {
  NewInvoiceImportFormData,
  newInvoiceImportSchema,
} from "../../schemas/invoiceImportSchema";

function NewTransactionForm() {
  const queryClient = useQueryClient();
  const { uploadInvoices } = useInvoice();
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
      type: undefined,
      updateWallet: undefined,
    },
  });

  const { mutateAsync } = useMutation({
    mutationFn: uploadInvoices,
    onSuccess: (response: any) => {
      setSearchParams((state) => {
        state.delete("invoice");
        return state;
      });
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });
      enqueueSnackbar(response.message, {
        variant: "success",
        autoHideDuration: 3000,
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });
    },
    onError: (err: any) => {
      enqueueSnackbar(err.response.data.message, {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });
    },
  });

  async function importFiles(data: NewInvoiceImportFormData) {
    await mutateAsync({
      invoices: data.invoices,
      institution: data.institution,
      type: data?.type,
      updateWallet: data?.updateWallet,
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
        marginTop: 10,
      }}
    >
      <Controller
        name="invoices"
        control={control}
        render={() => (
          <FormControl sx={{ width: "100%" }}>
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
          </FormControl>
        )}
      />

      <Controller
        name="institution"
        control={control}
        render={({ field: { onChange, value } }) => (
          <FormControl sx={{ width: "100%" }}>
            <InputLabel>Bank Institution</InputLabel>
            <Select
              size="small"
              value={value}
              label="Bank Institution"
              onChange={onChange}
            >
              {Object.values(BankInstitutions).map((item, index) => {
                return (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        )}
      />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Typography component="h2">Global optional options</Typography>
        <Tooltip
          title="Changes made below will apply to every transaction imported."
          arrow
          placement="top"
        >
          <HelpOutlineRounded
            sx={{
              fontSize: "16px",
              marginLeft: 0.5,
            }}
          />
        </Tooltip>
      </Box>

      <Controller
        name="type"
        control={control}
        render={({ field: { onChange, value, name } }) => (
          <FormControl>
            <FormLabel
              sx={{ mb: 1, "&.Mui-disabled": { color: "white" } }}
              disabled={true}
              about="teste"
            >
              Type
            </FormLabel>
            <RadioGroup
              defaultValue={undefined}
              name={name}
              value={value}
              onChange={onChange}
            >
              {Object.values(TypeOption).map((item, i) => {
                return (
                  <FormControlLabel
                    key={i}
                    value={item}
                    control={<Radio />}
                    label={typeOptionMask(item)}
                    sx={{
                      backgroundColor: grey[900],
                      p: 1,
                      m: 0.5,
                      borderRadius: 2,
                    }}
                  />
                );
              })}
            </RadioGroup>
          </FormControl>
        )}
      />
      <FormGroup>
        <FormControlLabel
          control={
            <Controller
              name="updateWallet"
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <Checkbox
                  name={name}
                  checked={value}
                  onChange={onChange}
                  inputProps={{ "aria-label": "controlled" }}
                />
              )}
            />
          }
          label="Update wallet"
        />
      </FormGroup>

      <Button type="submit" variant="contained">
        Import
      </Button>
    </form>
  );
}

export default NewTransactionForm;
