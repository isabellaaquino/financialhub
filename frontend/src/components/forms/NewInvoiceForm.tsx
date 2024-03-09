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
import { useSnackbar } from "notistack";
import { Controller, useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { TypeOption, typeOptionMask } from "../../models/Transaction";
import {
  NewTransactionFormData,
  newTransactionFormSchema,
} from "../../schemas/newTransactionSchema";
import AsyncAutocomplete from "../AsyncAutocomplete";
import { useInvoice } from "../../hooks/api/useInvoice";

function NewTransactionForm() {
  const queryClient = useQueryClient();
  const {uploadInvoice} = useInvoice();
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
    mutationFn: uploadInvoice,
    onSuccess: () => {
      setSearchParams((state) => {
        state.delete("transaction");
        return state;
      });
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
  console.log(errors);

  // async function addNewTransaction(data: NewTransactionFormData) {
  //   await mutateAsync({ files: data });
  // }

  return (
   <></>
  );
}

export default NewTransactionForm;
