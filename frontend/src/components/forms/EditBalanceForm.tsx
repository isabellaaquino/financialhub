import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import {
  EditBalanceFormData,
  editBalanceFormSchema,
} from "../../schemas/editBalanceSchema";
import walletService from "../../api/services/WalletService";

interface Props {
  setState: React.Dispatch<React.SetStateAction<boolean>>;
}

function EditBalanceForm(props: Props) {
  const queryClient = useQueryClient();
  const { authTokens } = useAuth();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EditBalanceFormData>({
    resolver: zodResolver(editBalanceFormSchema),
  });

  const { mutateAsync } = useMutation({
    mutationFn: walletService.updateWallet,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["wallet", authTokens!.access],
      });
      props.setState(false);
    },
    onError: () => {
      console.log("No server response");
    },
  });

  async function editBalance(data: EditBalanceFormData) {
    await mutateAsync({
      accessToken: authTokens!.access,
      value: data.balance,
    });
  }

  return (
    <form
      onSubmit={handleSubmit(editBalance)}
      id="editBalance"
      className="flex flex-row items-center justify-center gap-1"
    >
      <Controller
        name="balance"
        control={control}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <TextField
            error={!!error}
            onChange={onChange}
            value={value}
            label=""
            variant="outlined"
            size="small"
            sx={{ borderColor: grey[800], maxHeight: "32px" }}
          />
        )}
      />
    </form>
  );
}

export default EditBalanceForm;
