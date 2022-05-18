import React from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import IconMapping from "../components/mappings/iconMappings";

const mdTheme = createTheme();

const Login = (props) => {
  const GoogleIcon = IconMapping["Google"];
  return (
    <ThemeProvider theme={mdTheme}>
      <CssBaseline />
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "100vh" }}
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[900],
        }}
      >
        <Grid item xs={3}>
          <Paper>
            <Grid
              item
              container
              direction="column"
              alignItems="center"
              justifyContent="space-evenly"
              spacing={1}
              style={{ minHeight: "50vh", maxWidth: "30vw", minWidth: "25vw" }}
            >
              <Grid item xs={4}>
                <Typography variant="h2" color="primary" gutterBottom>
                  Safe Store
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Button variant="contained" endIcon={<GoogleIcon />}>
                  Log In
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default Login;
