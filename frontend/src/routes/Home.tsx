import { Link, useSearchParams } from "react-router-dom";
import CurrentMonthChart from "../components/charts/CurrentMonthChart";
import ProfileChart from "../components/charts/ProfileChart";
import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Grid, Typography } from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import WalletGridRow from "../components/dashboard/WalletGridRow";
import AddLabel from "../components/modals/AddLabel";
import { useQuery } from "@tanstack/react-query";
import { useTransactions } from "../hooks/api/useTransactions";
import LatestTransactions from "../components/LatestTransactions";
import AddTransaction from "../components/modals/AddTransaction";
import { useWallet } from "../hooks/api/useWallet";

const QUERY_LIMIT = 10;
function Home() {
  const { getTransactions } = useTransactions();
  const { getWallet } = useWallet();
  const [_, setSearchParams] = useSearchParams();

  const { data: transactions } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => getTransactions(QUERY_LIMIT),
  });

  const { data: wallet } = useQuery({
    queryKey: ["wallet"],
    queryFn: () => getWallet(),
  });

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
            <CurrentMonthChart />
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

      <AddTransaction />
      <AddLabel />
    </>
  );
}

export default Home;
