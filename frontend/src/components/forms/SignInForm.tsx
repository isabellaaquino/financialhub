import { zodResolver } from "@hookform/resolvers/zod";
import { Container, TextField, Button, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { SignInFormData, signInFormSchema } from "../../schemas/signInSchema";
import { useMutation } from "@tanstack/react-query";

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
    <form
      onSubmit={handleSubmit(signIn)}
      className="flex justify-center items-center m-10"
      style={{
        margin: "0 auto",
        marginTop: 60,
      }}
    >
      <Container
        sx={{ display: "flex", flexDirection: "column", gap: 3, width: 500 }}
      >
        <Controller
          name="email"
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              fullWidth
              autoFocus
              helperText={error ? error.message : null}
              // size="small"
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
              autoFocus
              helperText={error ? error.message : null}
              // size="small"
              error={!!error}
              onChange={onChange}
              value={value}
              label="Password"
              variant="outlined"
              type="password"
            />
          )}
        />
        <Button type="submit" variant="contained" size="large">
          Sign In
        </Button>
        <Typography color="gray" fontSize="medium" textAlign="center">
          Don't have an account? <Link to="/sign-up">Sign up</Link>
        </Typography>
      </Container>
    </form>
  );
}

export default SignInForm;
