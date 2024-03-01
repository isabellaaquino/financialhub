import { Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import SignIn from "./SignIn";
import { Box, Toolbar } from "@mui/material";
import AppDrawer from "../components/AppDrawer";

function Root() {
  let { user } = useAuth();

  return (
    <Box sx={{ display: "flex" }}>
      {user ? (
        <>
          <AppDrawer />
          <Box sx={{ p: 5, width: "100%" }}>
            <Toolbar />
            <Outlet />
          </Box>
        </>
      ) : (
        <SignIn />
      )}
    </Box>
  );
}

export default Root;
