import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useWallet } from "../../hooks/useWallet";
import { darkTheme } from "../../theme";
import { formatValue } from "../../utils/utils";
import EditBalanceForm from "../forms/EditBalanceForm";

function WalletGridRow() {
  const { authTokens } = useAuth();
  const [isEditingBalance, setIsEditingBalance] = useState(false);

  const {
    data: wallet,
    isPending,
    isError,
    error,
  } = useWallet(authTokens!.access);

  if (isPending) return <span>Loading...</span>;

  if (isError) return <span>Error: {error.message}</span>;

  return (
    <>
      <Grid item xs={12} lg={4}>
        <Box
          border="1px solid"
          borderColor={darkTheme.palette.background.paper}
          borderRadius={2}
          padding={3}
          height={"100%"}
        >
          <Typography component="h2" variant="body1" mb={1}>
            Balance
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            {!isEditingBalance ? (
              <Typography component="span" variant="h5" fontWeight={600}>
                {formatValue(wallet.current_amount, 10_000)}
              </Typography>
            ) : (
              <EditBalanceForm setState={setIsEditingBalance} />
            )}
            <Box display={"flex"}>
              {isEditingBalance && (
                <IconButton
                  form="editBalance"
                  sx={{
                    borderRadius: 2,
                    color: grey[500],
                    "&:hover": { backgroundColor: grey[900] },
                  }}
                  size="small"
                  type="submit"
                >
                  <DoneIcon />
                </IconButton>
              )}

              <Box onClick={() => setIsEditingBalance(!isEditingBalance)}>
                {isEditingBalance ? (
                  <IconButton
                    sx={{
                      borderRadius: 2,
                      color: grey[500],
                      "&:hover": { backgroundColor: grey[900] },
                    }}
                    size="small"
                    aria-label="cancel"
                  >
                    <CloseIcon />
                  </IconButton>
                ) : (
                  <IconButton
                    sx={{
                      borderRadius: 2,
                      color: grey[500],
                      "&:hover": { backgroundColor: grey[900] },
                    }}
                    size="small"
                    aria-label="edit"
                  >
                    <ModeEditIcon />
                  </IconButton>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} sm={6} lg={4}>
        <Box
          border="1px solid"
          borderColor={darkTheme.palette.background.paper}
          borderRadius={2}
          padding={3}
          height={"100%"}
        >
          <Typography component="h2" variant="body1" mb={1}>
            Monthly Earnings
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography component="span" variant="h5" fontWeight={600}>
              +{formatValue(wallet.monthly_earnings, 10_000)}
            </Typography>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} sm={6} lg={4}>
        <Box
          border="1px solid"
          borderColor={darkTheme.palette.background.paper}
          borderRadius={2}
          padding={3}
          height={"100%"}
        >
          <Typography component="h2" variant="body1" mb={1}>
            Monthly Expenses
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography component="span" variant="h5" fontWeight={600}>
              -{formatValue(wallet.monthly_expenses, 10_000)}
            </Typography>
          </Box>
        </Box>
      </Grid>
    </>
  );
}

export default WalletGridRow;
