import {
  NewTransactionFormData,
  newTransactionFormSchema,
} from "../../schemas/newTransactionSchema";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TypeOption, typeOptionMask } from "../../models/Transaction";
import { grey } from "@mui/material/colors";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import dateService from "../../api/services/DateService";
import AsyncAutocomplete from "../AsyncAutocomplete";
import AddIcon from "@mui/icons-material/Add";
import { useSnackbar } from "notistack";
import { useTransactions } from "../../hooks/api/useTransactions";

function NewTransactionForm() {
  const queryClient = useQueryClient();
  const { createTransaction } = useTransactions(dateService.currentYear());
  const { enqueueSnackbar } = useSnackbar();
  const [_, setSearchParams] = useSearchParams();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<NewTransactionFormData>({
    resolver: zodResolver(newTransactionFormSchema),
  });

  const { mutateAsync } = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      setSearchParams((state) => {
        state.delete("transaction");
        return state;
      });
      queryClient.invalidateQueries({
        queryKey: ["transactions", dateService.currentYear()],
      });
      queryClient.invalidateQueries({
        queryKey: ["wallet"],
      });
      enqueueSnackbar("Transaction created successfully!", {
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

  async function addNewTransaction(data: NewTransactionFormData) {
    await mutateAsync({ transaction: data });
  }

  return (
    <form
      onSubmit={handleSubmit(addNewTransaction)}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        width: "500px",
        marginTop: 20,
      }}
    >
      <Controller
        name="title"
        control={control}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <TextField
            fullWidth
            autoFocus
            helperText={error ? error.message : null}
            error={!!error}
            onChange={onChange}
            value={value}
            label="Title"
            variant="outlined"
            size="small"
          />
        )}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Controller
          name="label"
          control={control}
          // onChange={(e: any, data: any) => data}
          render={({ field: { onChange, value } }) => (
            <AsyncAutocomplete onChange={onChange} value={value} />
          )}
        />

        <Button
          variant="contained"
          onClick={() =>
            setSearchParams((state) => {
              if (!state.get("label")) state.set("label", "1");
              return state;
            })
          }
        >
          <AddIcon />
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Controller
          name="value"
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              fullWidth
              autoFocus
              helperText={error ? error.message : null}
              error={!!error}
              onChange={onChange}
              value={value}
              label="Amount"
              variant="outlined"
              size="small"
              InputProps={{
                style: { fontSize: "14px", height: "40px" },
                startAdornment: (
                  <InputAdornment position="start">R$</InputAdornment>
                ),
              }}
            />
          )}
        />

        <Controller
          name="date"
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date"
                  value={value}
                  onChange={onChange}
                  slotProps={{ textField: { size: "small" } }}
                />
              </LocalizationProvider>
            </>
          )}
        />
      </Box>
      <Controller
        name="type"
        control={control}
        render={({
          field: { onChange, value, name },
          fieldState: { error },
        }) => (
          <FormControl>
            <FormLabel
              sx={{ mb: 1, "&.Mui-disabled": { color: "white" } }}
              disabled={true}
            >
              Type
            </FormLabel>
            <RadioGroup
              defaultValue={TypeOption.EXPENSE}
              name={name}
              value={value}
              onChange={onChange}
            >
              {Object.values(TypeOption).map((item) => {
                return (
                  <FormControlLabel
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
      <Typography component="h6">Options</Typography>
      <FormGroup>
        <FormControlLabel
          control={
            <Controller
              name="updateWallet"
              control={control}
              render={({
                field: { onChange, value, name },
                fieldState: { error },
              }) => (
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
        <FormControlLabel
          control={
            <Controller
              name="recurring"
              control={control}
              render={({
                field: { onChange, value, name },
                fieldState: { error },
              }) => (
                <Checkbox
                  name={name}
                  checked={value}
                  onChange={onChange}
                  inputProps={{ "aria-label": "controlled" }}
                />
              )}
            />
          }
          label="Recurring"
        />
      </FormGroup>

      <Button type="submit" variant="contained">
        Add
      </Button>
    </form>
  );
}

export default NewTransactionForm;