import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import {
  NewLabelFormData,
  newLabelFormSchema,
} from "../../schemas/newLabelSchema";
import { grey } from "@mui/material/colors";
import { useLabels } from "../../hooks/api/useLabels";

function NewLabelForm() {
  const queryClient = useQueryClient();
  const { createLabel } = useLabels();
  const { enqueueSnackbar } = useSnackbar();
  const [_, setSearchParams] = useSearchParams();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<NewLabelFormData>({
    resolver: zodResolver(newLabelFormSchema),
    values: {
      name: "",
      color: "#000000",
    },
  });

  const { mutateAsync } = useMutation({
    mutationFn: createLabel,
    onSuccess: () => {
      setSearchParams((state) => {
        state.delete("label");
        return state;
      });
      queryClient.invalidateQueries({
        queryKey: ["wallet"],
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
    await mutateAsync({ label: data });
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
        render={({ field: { onChange, value } }) => (
          <TextField
            fullWidth
            autoFocus
            helperText={errors.name ? errors.name.message : " "}
            error={!!errors.name}
            onChange={onChange}
            value={value}
            defaultValue = {''}
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
          render={({ field: { onChange, value, name } }) => (
            <>
              <Typography>{value}</Typography>
              <TextField
                name={name}
                onChange={onChange}
                value={value}
                label="Color"
                defaultValue = {''}
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
