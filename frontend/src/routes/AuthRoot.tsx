import { Box, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Outlet } from "react-router-dom";
function AuthRoot() {
  return (
    <Box
      sx={{ display: "flex", justifyContent: "space-between", height: "100vh" }}
    >
      <Box
        sx={{
          backgroundColor: grey[900],
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <Typography variant="h6" component="h1" p={5} fontWeight={600}>
          Financialhub
        </Typography>
        <Box p={5} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body2" component="small" color={grey[500]}>
            Isabella e Pedro - 2024
          </Typography>
          {/* <Link
            href="#"
            variant="body2"
            sx={{ color: grey[500], "&:hover": { color: grey[300] } }}
          >
            Isabella e Pedro - 2024 <GitHubIcon />
          </Link> */}
        </Box>
      </Box>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default AuthRoot;
