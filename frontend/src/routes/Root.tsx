import { Box, Toolbar } from "@mui/material";
import AppDrawer from "../components/AppDrawer";
import RequireAuth from "../components/auth/RequireAuth";

function Root() {
  return (
    <Box sx={{ display: "flex" }}>
      <>
        <AppDrawer />
        <Box sx={{ p: 5, width: "100%" }}>
          <Toolbar />
          <RequireAuth />
        </Box>
      </>
    </Box>
  );
}

export default Root;
