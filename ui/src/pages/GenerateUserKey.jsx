import * as React from "react";
import { useNavigate } from "react-router-dom";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { ThemeProvider } from "@mui/material/styles";

import LoadingSection from "../components/sections/LoadingSection";
import SecureStorePageLayout from "../components/layout/SecureStorePageLayout";

import { didUserActivateSession } from "../services/api/users";

const GenerateUserKey = (props) => {
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
          <Grid item xs={12} alignContent="center">
            <Paper
              sx={{
                p: 4,
                display: "flex",
                flexDirection: "column",
                height: "75vh",
                width: "100%",
              }}
            >
              <Grid item container xs={12} direction="column" spacing={6}>
                <Grid item container spacing={2} xs={2} alignItems="center">
                  <Grid item>
                    <Autocomplete
                      disablePortal
                      defaultValue={"1024"}
                      id="key-length-select"
                      options={["1024", "2048", "4096"]}
                      sx={{ minWidth: 200 }}
                      renderInput={(params) => <TextField {...params} label="Key Length" contentEditable={false} />}
                    />
                  </Grid>
                  <Grid item>
                    <Button
                      className="btn-upload"
                      color="primary"
                      variant="contained"
                      component="span"
                      onClick={() => {}}
                    >
                      Generate Key Pair
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      className="btn-upload"
                      color="primary"
                      variant="contained"
                      component="span"
                      disabled
                      onClick={() => {}}
                    >
                      Submit and Download
                    </Button>
                  </Grid>
                </Grid>
                <Grid item container xs={10} justifyContent="space-evenly" alignItems="flex-start" spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      id="rsa-priv-key"
                      label="Private Key"
                      variant="outlined"
                      multiline
                      minRows={15}
                      maxRows={18}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      id="rsa-pub-key"
                      label="Public Key"
                      variant="outlined"
                      multiline
                      minRows={15}
                      maxRows={18}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </SecureStorePageLayout>
      )}
    </ThemeProvider>
  );
};

export default GenerateUserKey;
