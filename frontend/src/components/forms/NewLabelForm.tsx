import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useSnackbar } from "notistack";
import {
  NewLabelFormData,
  newLabelFormSchema,
} from "../../schemas/newLabelSchema";
import labelService from "../../api/services/LabelService";
import { grey } from "@mui/material/colors";

function NewLabelForm() {
  const queryClient = useQueryClient();
  const { authTokens } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [_, setSearchParams] = useSearchParams();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<NewLabelFormData>({
    resolver: zodResolver(newLabelFormSchema),
  });

  const { mutateAsync } = useMutation({
    mutationFn: labelService.createLabelAPI,
    onSuccess: () => {
      setSearchParams((state) => {
        state.delete("label");
        return state;
      });
      queryClient.invalidateQueries({
        queryKey: ["labels", authTokens!.access],
      });
      enqueueSnackbar("Label created successfully!", {
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

  async function addNewLabel(data: NewLabelFormData) {
    await mutateAsync({ accessToken: authTokens!.access, label: data });
  }

  return (
    <form
      onSubmit={handleSubmit(addNewLabel)}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        width: "500px",
        marginTop: 20,
      }}
    >
      <Controller
        name="name"
        control={control}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <TextField
            fullWidth
            autoFocus
            helperText={error ? error.message : null}
            error={!!error}
            onChange={onChange}
            value={value}
            label="Name"
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
          name="color"
          control={control}
          render={({
            field: { onChange, value, name },
            fieldState: { error },
          }) => (
            <>
              <Typography>{value ?? "#000000"}</Typography>
              <TextField
                name={name}
                error={!!error}
                onChange={onChange}
                value={value ?? "#000000"}
                label="Color"
                variant="outlined"
                size="small"
                type="color"
                fullWidth
                sx={{ borderColor: grey[800], maxHeight: "32px" }}
              />
            </>
          )}
        />
      </Box>

      <Button type="submit" variant="contained">
        Add
      </Button>
    </form>
  );
}

export default NewLabelForm;
