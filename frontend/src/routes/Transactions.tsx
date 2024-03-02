import dateService from "../api/services/DateService";
import { Box, InputAdornment, TextField, Typography } from "@mui/material";
import LatestTransactions from "../components/LatestTransactions";
import SearchIcon from "@mui/icons-material/Search";
import { grey } from "@mui/material/colors";
import { useTransactions } from "../hooks/api/useTransactions";

function Transactions() {
  const {
    query: { data: transactions },
  } = useTransactions(dateService.currentYear());
  return (
    <>
      <Typography component="h1" variant="h4" fontWeight={600} mb={4}>
        Transactions
      </Typography>
      <Box>
        <form>
          <TextField
            fullWidth
            label=""
            variant="outlined"
            size="medium"
            placeholder="Find transaction"
            // onChange={handleSearchChange}
            InputProps={{
              style: { fontSize: "14px", height: "40px" },
              startAdornment: (
                <InputAdornment position="start" sx={{ color: grey[800] }}>
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
        </form>
        <LatestTransactions data={transactions ?? []} headOnly={false} />
      </Box>
    </>
  );
}

export default Transactions;
