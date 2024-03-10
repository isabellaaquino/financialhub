import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Button, Typography, Box } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { SignInFormData, signInFormSchema } from "../../schemas/signInSchema";
import { useMutation } from "@tanstack/react-query";
import { grey } from "@mui/material/colors";

function SignInForm() {
  let navigate = useNavigate();
  const { SignIn } = useAuth();
  const { handleSubmit, control } = useForm<SignInFormData>({
    resolver: zodResolver(signInFormSchema),
  });

  const { mutateAsync } = useMutation({
    mutationFn: SignIn,
    onSuccess: () => {
      navigate("/");
    },
    onError: () => {
      console.log("No server response");
    },
  });

  async function signIn(data: SignInFormData) {
    await mutateAsync({ email: data.email, password: data.password });
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        width: "400px",
      }}
    >
      <Box>
        <Typography
          variant="h5"
          component="h1"
          fontWeight={600}
          lineHeight={1.8}
        >
          Welcome back
        </Typography>
        <Typography variant="body2" component="p" color={grey[500]}>
          Please sign in to access your account
        </Typography>
      </Box>
      <form
        onSubmit={handleSubmit(signIn)}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
        }}
      >
        <Controller
          name="email"
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              fullWidth
              size="small"
              autoFocus
              helperText={error ? error.message : null}
              defaultValue={""}
              error={!!error}
              onChange={onChange}
              value={value}
              label="Email"
              variant="outlined"
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              fullWidth
              size="small"
              autoFocus
              helperText={error ? error.message : null}
              defaultValue={""}
              error={!!error}
              onChange={onChange}
              value={value}
              label="Password"
              variant="outlined"
              type="password"
            />
          )}
        />
        <Button type="submit" variant="contained" size="medium">
          Sign In
        </Button>
        <Typography
          color="gray"
          variant="body2"
          component="p"
          textAlign="center"
        >
          Don't have an account? <Link to="/auth/sign-up">Sign up</Link>
        </Typography>
      </form>
    </Box>
  );
}

export default SignInForm;
