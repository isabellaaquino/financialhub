import { zodResolver } from "@hookform/resolvers/zod";
import AddIcon from "@mui/icons-material/Add";
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
import { grey } from "@mui/material/colors";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useSnackbar } from "notistack";
import { Controller, useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { TypeOption } from "../../enums/Enums";
import { useTransactions } from "../../hooks/api/useTransactions";
import { typeOptionMask } from "../../models/Transaction";
import {
  NewTransactionFormData,
  newTransactionFormSchema,
} from "../../schemas/newTransactionSchema";
import { formatCurrency } from "../../utils/utils";
import AsyncAutocomplete from "../AsyncAutocomplete";

function NewTransactionForm() {
  const queryClient = useQueryClient();
  const { createTransaction } = useTransactions();
  const { enqueueSnackbar } = useSnackbar();
  const [_, setSearchParams] = useSearchParams();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<NewTransactionFormData>({
    resolver: zodResolver(newTransactionFormSchema),
    values: {
      title: "",
      value: 0,
      label: {
        id: 0,
        name: "",
        color: "",
      },
      date: dayjs(new Date().toLocaleDateString(), "DD-MM-YYYY"),
      type: TypeOption.EXPENSE,
      updateWallet: false,
      recurring: false,
    },
  });

  const { mutateAsync } = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      setSearchParams((state) => {
        state.delete("transaction");
        return state;
      });
      //get transaction id
      // queryClient.setQueryData(['transactions', { id: variables.transaction. }], data)
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
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
        render={({ field: { onChange, value } }) => (
          <TextField
            fullWidth
            autoFocus
            helperText={errors.title ? errors.title.message : " "}
            error={!!errors.title}
            onChange={onChange}
            defaultValue={""}
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
          render={({ field: { onChange, value } }) => (
            <AsyncAutocomplete
              onChange={onChange}
              value={value}
              helperText={errors.label ? errors.label.name?.message : " "}
              error={!!errors.label?.name}
            />
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
          sx={{ mb: 3 }}
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
          render={({ field: { onChange, value } }) => (
            <TextField
              fullWidth
              autoFocus
              helperText={errors.value ? errors.value.message : " "}
              error={!!errors.value}
              defaultValue={""}
              onChange={(e) => {
                const formattedValue = formatCurrency(e.target.value);
                onChange(formattedValue);
              }}
              value={value === 0 ? "" : value}
              label="Amount"
              variant="outlined"
              size="small"
              placeholder="0,00"
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
          render={({ field: { onChange, value } }) => (
            <>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date"
                  value={value}
                  onChange={onChange}
                  defaultValue={""}
                  slotProps={{
                    textField: {
                      size: "small",
                      error: !!errors.date,
                      helperText: errors.date ? errors.date.message : " ",
                    },
                  }}
                />
              </LocalizationProvider>
            </>
          )}
        />
      </Box>
      <Controller
        name="type"
        control={control}
        render={({ field: { onChange, value, name } }) => (
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
      <Typography component="h6">Options</Typography>
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
        {/* <FormControlLabel
          control={
            <Controller
              name="recurring"
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
          label="Recurring"
        /> */}
      </FormGroup>

      <Button type="submit" variant="contained">
        Add
      </Button>
    </form>
  );
}

export default NewTransactionForm;
