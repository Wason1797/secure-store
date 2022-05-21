import * as React from "react";
import { useNavigate } from "react-router-dom";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { ThemeProvider } from "@mui/material/styles";

import LoadingSection from "../components/sections/LoadingSection";
import SecureStorePageLayout from "../components/layout/SecureStorePageLayout";

import { didUserActivateSession } from "../services/api/users";


const UpdateUserKey = (props) => {
  const [isLoading, setLoading] = React.useState(true);
  const [activeUser, setActiveUser] = React.useState(null);

  const navigate = useNavigate();

  React.useEffect(() => {
    didUserActivateSession().then((activeUser) => {
      if (!activeUser) {
        navigate("/login");
        return;
      }

      setActiveUser(activeUser);
      setLoading(false);
    });
  }, [navigate]);

  return (
    <ThemeProvider theme={props.mdTheme}>
      {isLoading ? (
        <LoadingSection />
      ) : (
        <SecureStorePageLayout avatarImgSrc={activeUser.picture}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={5} lg={4}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  height: 380,
                }}
              >
              </Paper>
            </Grid>
            <Grid item xs={12} md={7} lg={8}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  height: 380,
                }}
              >
              </Paper>
            </Grid>
            <Grid container spacing={0.5} item xs={12} direction="column">
              <Grid item>
                <Paper sx={{ p: 2, display: "flex", flexDirection: "column", minHeight: 200 }}>
                </Paper>
              </Grid>
              <Grid item>
                <Paper sx={{ p: 2, display: "flex" }}>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </SecureStorePageLayout>
      )}
    </ThemeProvider>
  );
};

export default UpdateUserKey;
