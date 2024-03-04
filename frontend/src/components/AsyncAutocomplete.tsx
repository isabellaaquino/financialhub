import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { useQuery } from "@tanstack/react-query";
import { useLabels } from "../hooks/api/useLabels";
import { CustomLabel } from "../models/CustomLabel";
import { useState } from "react";
import { TextField } from "@mui/material";
import React from "react";

interface Props {
  onChange: any;
  value: CustomLabel | null;
  helperText?: string;
  error?: boolean;
}

export default function AsyncAutocomplete(props: Props) {
  const { getLabels } = useLabels();
  const [open, setOpen] = useState(false);
  const { data: labels, isLoading } = useQuery({
    queryKey: ["labels"],
    queryFn: () => getLabels(),
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
      onChange={(_, data) => props.onChange(data)}
      value={props.value}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Label"
          error={props.error}
          helperText={props.helperText}
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
