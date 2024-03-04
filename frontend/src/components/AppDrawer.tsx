import * as React from "react";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { grey } from "@mui/material/colors";
import { darkTheme } from "../theme";
import { navigation } from "../navigation";
import {
  AppBar,
  Box,
  Drawer,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import Select from "@mui/material/Select";
import { Link } from "react-router-dom";
import UserDropdown from "./UserDropdown";

const drawerWidth = 240;
interface Props {
  window?: () => Window;
}

export default function DrawerAppBar(props: Props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box
      onClick={handleDrawerToggle}
      sx={{
        textAlign: "center",
        background: darkTheme.palette.background.default,
      }}
    >
      <Typography
        variant="body1"
        component="h1"
        fontWeight={600}
        sx={{ my: 2 }}
      >
        Financialhub
      </Typography>
      <Divider />
      <List>
        {navigation.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton sx={{ textAlign: "center" }}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        component="nav"
        sx={{
          background: darkTheme.palette.background.default,
          borderBottom: `1px solid ${darkTheme.palette.background.paper}`,
        }}
      >
        <Toolbar
          sx={{ mx: 2, display: "flex", justifyContent: "space-between" }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "start",
            }}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="body1"
              component="h1"
              fontWeight={600}
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              Financialhub
            </Typography>
            <Divider
              orientation="vertical"
              sx={{
                display: { xs: "none", xl: "flex" },
                justifyContent: "center",
                borderColor: darkTheme.palette.background.paper,
                height: "30px",
                p: 2,
                mr: 2,
              }}
            />
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              {navigation.map((item) => (
                <Link
                  to={item.path}
                  key={item.label}
                  style={{
                    color: "#fff",
                    marginRight: 28,
                    textDecoration: "none",
                    fontSize: "14px",
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            {/* <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={2021}
              label=""
              size="small"
              // onChange={handleChange}
              sx={{
                color: grey[400],
                height: "35px",
                width: "120px",
              }}
            >
              <MenuItem value={2021}>2021</MenuItem>
              <MenuItem value={2022}>2022</MenuItem>
              <MenuItem value={2023}>2023</MenuItem>
            </Select> */}

            <UserDropdown />
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            style: { background: darkTheme.palette.background.default },
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
}
