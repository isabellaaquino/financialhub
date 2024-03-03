import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import * as React from "react";
import { useAuth } from "../hooks/useAuth";
import { useWallet } from "../hooks/useWallet";

export default function AsyncAutocomplete({ onChange, value }: any) {
  const { authTokens } = useAuth();
  const [open, setOpen] = React.useState(false);
  const { data: wallet, isLoading } = useWallet(authTokens!.access);

  return (
    <Autocomplete
      size="small"
      loading={isLoading}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      options={wallet?.labels ?? []}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, value) => option.name === value.name}
      onChange={(_, data) => onChange(data)}
      value={value}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Label"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {isLoading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
      fullWidth
    />
  );
}
