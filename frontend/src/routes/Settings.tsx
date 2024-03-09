import {
  Box,
  Container,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { grey } from "@mui/material/colors";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
function Settings() {
  return (
    <>
      {/* <Typography component="h1" variant="h4" fontWeight={600}>
        Settings
      </Typography> */}
      <Box
        sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}
      >
        <nav>
          <List>
            <ListItem>
              <ListItemButton style={{ color: grey[500] }}>
                <ListItemIcon style={{ color: grey[500] }}>
                  {<PersonIcon />}
                </ListItemIcon>
                <ListItemText primary="General" />
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton style={{ color: grey[500] }}>
                <ListItemIcon style={{ color: grey[500] }}>
                  {<LocalOfferIcon />}
                </ListItemIcon>
                <ListItemText primary="Labels" />
              </ListItemButton>
            </ListItem>
          </List>
        </nav>
        <Container sx={{ display: "flex", gap: 6, flexDirection: "column" }}>
          <Box>
            <Typography component="h1" variant="h6" mb={2} fontWeight={600}>
              Profile
            </Typography>
            <Divider />
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Box py={4} sx={{ display: "flex", gap: 28 }}>
                <Typography
                  component="h1"
                  variant="body1"
                  width={"200px"}
                  color={grey[500]}
                >
                  Full name
                </Typography>
                <Typography component="h1" variant="body1">
                  {"Pedro Dell'Olio"}
                </Typography>
              </Box>
              <Divider />
              <Box py={4} sx={{ display: "flex", gap: 28 }}>
                <Typography
                  component="h1"
                  variant="body1"
                  width={"200px"}
                  color={grey[500]}
                >
                  Email address
                </Typography>
                <Typography component="h1" variant="body1">
                  {"pedro@email.com"}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box>
            <Typography component="h1" variant="h6" mb={2} fontWeight={600}>
              Options
            </Typography>
            <Divider />
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Box py={4} sx={{ display: "flex", gap: 28 }}>
                <Typography
                  component="h1"
                  variant="body1"
                  width={"200px"}
                  color={grey[500]}
                >
                  First of the month
                </Typography>
                <Stack gap={1}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label={""}
                      views={["day"]}
                      slotProps={{
                        textField: {
                          size: "small",
                          style: {
                            width: "180px",
                          },
                        },
                      }}
                    />
                  </LocalizationProvider>
                  <Typography
                    component="small"
                    variant="caption"
                    color={grey[500]}
                  >
                    Define the starting day for monthly expenses and earnings.
                  </Typography>
                </Stack>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default Settings;
