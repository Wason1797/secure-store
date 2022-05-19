import React from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import IconMapping from "../components/mappings/iconMappings";
import EnvManager from "../config/envManager";
import { didUserActivateSession } from "../services/api/users";
import LoadingSection from "../components/sections/LoadingSection";
import { useNavigate } from "react-router-dom";

const mdTheme = createTheme();

const loginUrl = `${EnvManager.BACKEND_URL}/auth/login`;

const Login = (props) => {
  const GoogleIcon = IconMapping["Google"];
  const [isLoading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    didUserActivateSession().then((isSessionActive) => {
      if (isSessionActive) navigate("/dashboard");
      setLoading(false);
    });
  }, [navigate]);

  return (
    <ThemeProvider theme={mdTheme}>
      {isLoading ? (
        <LoadingSection />
      ) : (
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
                p={2}
                style={{ minHeight: "50vh", maxWidth: "50vw", minWidth: "20vw" }}
              >
                <Grid item xs={4}>
                  <Typography variant="h2" color="primary" align="center" gutterBottom>
                    Secure Store
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Button variant="contained" size="large" href={loginUrl} endIcon={<GoogleIcon />}>
                    Log In
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}
    </ThemeProvider>
  );
};

export default Login;
