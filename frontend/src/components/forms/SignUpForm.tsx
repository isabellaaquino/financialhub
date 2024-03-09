import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Button, Typography, Box } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { grey } from "@mui/material/colors";
import { SignUpFormData, signUpFormSchema } from "../../schemas/signUpSchema";

function SignUpForm() {
  let navigate = useNavigate();
  const { SignUp } = useAuth();
  const { handleSubmit, control } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
  });

  const { mutateAsync } = useMutation({
    mutationFn: SignUp,
    onSuccess: () => {
      navigate("/");
    },
    onError: () => {
      console.log("No server response");
    },
  });

  async function signUp(data: SignUpFormData) {
    await mutateAsync({
      user: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      },
    });
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
          Create an account
        </Typography>
        <Typography variant="body2" component="p" color={grey[500]}>
          Please sign up to access your account
        </Typography>
      </Box>
      <form
        onSubmit={handleSubmit(signUp)}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Controller
            name="firstName"
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                fullWidth
                autoComplete="new-password"
                size="small"
                defaultValue={""}
                autoFocus
                helperText={error ? error.message : null}
                error={!!error}
                onChange={onChange}
                value={value}
                label="First name"
                variant="outlined"
              />
            )}
          />

          <Controller
            name="lastName"
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                fullWidth
                autoComplete="new-password"
                size="small"
                defaultValue={""}
                autoFocus
                helperText={error ? error.message : null}
                error={!!error}
                onChange={onChange}
                value={value}
                label="Last name"
                variant="outlined"
              />
            )}
          />
        </Box>

        <Controller
          name="email"
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              fullWidth
              autoComplete="new-password"
              size="small"
              defaultValue={""}
              autoFocus
              helperText={error ? error.message : null}
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
              autoComplete="new-password"
              size="small"
              defaultValue={""}
              autoFocus
              helperText={error ? error.message : null}
              error={!!error}
              onChange={onChange}
              value={value}
              label="Password"
              variant="outlined"
              type="password"
            />
          )}
        />

        <Controller
          name="confirmPassword"
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              fullWidth
              autoComplete="new-password"
              size="small"
              defaultValue={""}
              autoFocus
              helperText={error ? error.message : null}
              error={!!error}
              onChange={onChange}
              value={value}
              label="Confirm password"
              variant="outlined"
              type="password"
              inputProps={{
                autocomplete: "new-password",
                form: {
                  autocomplete: "off",
                },
              }}
            />
          )}
        />

        <Button type="submit" variant="contained" size="medium">
          Sign Up
        </Button>
        <Typography
          color="gray"
          variant="body2"
          component="p"
          textAlign="center"
        >
          Already have an account? <Link to="/auth/sign-in">Sign in</Link>
        </Typography>
      </form>
    </Box>
  );
}

export default SignUpForm;
