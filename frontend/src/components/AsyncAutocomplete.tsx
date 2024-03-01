import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuth } from "../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import labelService from "../api/services/LabelService";
import { Controller } from "react-hook-form";

export default function AsyncAutocomplete({ onChange, value }: any) {
  const { authTokens } = useAuth();
  const [open, setOpen] = React.useState(false);
  const { data: labels, isLoading } = useQuery({
    queryKey: ["labels", authTokens!.access],
    queryFn: () => labelService.getUserLoggedLabels(authTokens!.access),
    enabled: open,
  });

  return (
    <Autocomplete
      size="small"
      loading={isLoading}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      options={labels ?? []}
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
