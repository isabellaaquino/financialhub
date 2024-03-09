import AddIcon from "@mui/icons-material/Add";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { Box, Button, Grid, Typography } from "@mui/material";
import { Link, useSearchParams } from "react-router-dom";
import dateService from "../api/services/DateService";
import LatestTransactions from "../components/LatestTransactions";
import CurrentMonthChart from "../components/charts/CurrentMonthChart";
import ProfileChart from "../components/charts/ProfileChart";
import WalletGridRow from "../components/dashboard/WalletGridRow";
import AddLabel from "../components/modals/AddLabel";
import AddTransaction from "../components/modals/AddTransaction";
import ImportInvoice from "../components/modals/ImportInvoices";
import { useAuth } from "../hooks/useAuth";
import { useTransactions } from "../hooks/useTransactions";
import { useWallet } from "../hooks/useWallet";
import { SummaryOption } from "../models/Summary";

function Home() {
  const { authTokens } = useAuth();
  const [_, setSearchParams] = useSearchParams();

  const { data: transactions } = useTransactions(
    authTokens!.access,
    dateService.currentYear()
  );

  const { data: wallet } = useWallet(authTokens!.access);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            md: "row",
          },
          justifyContent: "space-between",
          alignItems: {
            xs: "start",
            md: "center",
          },
        }}
      >
        <Typography component="h1" variant="h4" fontWeight={600}>
          Dashboard
        </Typography>
        <Box sx={{ marginTop: { xs: 2, md: 0 } }}>
          <Button
            variant="outlined"
            size="medium"
            sx={{ marginRight: 2 }}
            startIcon={<FileUploadIcon />}
            onClick={() =>
              setSearchParams((state) => {
                if (!state.get("invoice")) state.set("invoice", "1");
                return state;
              })
            }
          >
            Import invoice
          </Button>
          <Button
            variant="contained"
            size="medium"
            startIcon={<AddIcon />}
            onClick={() =>
              setSearchParams((state) => {
                if (!state.get("transaction")) state.set("transaction", "1");
                return state;
              })
            }
          >
            New transaction
          </Button>
        </Box>
      </Box>
      <Grid mt={2} container spacing={2} alignItems={"stretch"}>
        <WalletGridRow />
        <Grid item xs={12} lg={6}>
          {transactions ? (
            <CurrentMonthChart
              data={transactions}
              option={SummaryOption.Month}
            />
          ) : (
            <Typography component="p" variant="body1">
              Unable to load chart due to insufficient data.
            </Typography>
          )}
        </Grid>
        <Grid item xs={12} lg={6}>
          {wallet?.aggregated_expenses ? (
            <ProfileChart data={wallet.aggregated_expenses} />
          ) : (
            <Typography component="p" variant="body1">
              Unable to load chart due to insufficient data.
            </Typography>
          )}
        </Grid>
        <Grid item xs={12}>
          <Box height={"auto"}>
            <Typography component="h2" variant="h6" mb={1} mt={2}>
              Latest transactions
            </Typography>
            {transactions && (
              <>
                <LatestTransactions data={transactions} headOnly={true} />
                <Link to={"/transactions"}>
                  <Button
                    variant="contained"
                    size="medium"
                    sx={{ marginTop: 2 }}
                  >
                    Show more
                  </Button>
                </Link>
              </>
            )}
          </Box>
        </Grid>
      </Grid>

      <ImportInvoice />
      <AddTransaction />
      <AddLabel />
    </>
  );
}

export default Home;
