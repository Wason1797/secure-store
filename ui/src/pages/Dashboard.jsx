import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TableView from "../components/controls/TableView";
import FileUpload from "../components/controls/FileUpload";
import SecretInfoForm from "../components/inputSections/SecretInfoForm";
import AppBarDrawerCombo from "../components/controlSections/AppBarDrawerCombo";
import SecretsBreakdown from "../components/infoSections/SecretsBreakdown";
import Copyright from "../components/text/Copyright";
import { decryptSecretsWithPrivateKeyFile } from "../services/crypto/keyUtils";
import { useNavigate } from "react-router-dom";
import { getSecretsSharedWithMe, shareSecrets } from "../services/api/secrets";
import { getUsers, didUserActivateSession } from "../services/api/users";
import { logoutUserSession } from "../services/api/auth";
import LoadingSection from "../components/sections/LoadingSection";

const drawerWidth = 240;

const mdTheme = createTheme();

const drawerMenuItems = [
  {
    text: "Share Secrets",
    icon: "Dashboard",
    onClick: () => console.log("Share Secrets"),
  },
  {
    text: "Update Public Key",
    icon: "Key",
    onClick: () => console.log("Share Secrets"),
  },
];

const Dashboard = () => {
  const [users, setUsers] = React.useState([]);
  const [secrets, setSecrets] = React.useState([]);
  const [isLoading, setLoading] = React.useState(true);
  const [privateKey, setPrivateKey] = React.useState(null);
  const [decryptedSecrets, setDecryptedSecrets] = React.useState([]);
  const [secretsReadyToShare, setSecretsReadyToShare] = React.useState([]);
  const navigate = useNavigate();

  const tooltipMenuItems = [
    {
      title: "Logout",
      icon: "Logout",
      onClick: () =>
        logoutUserSession().then((didLogout) => {
          if (didLogout) {
            navigate("/login");
          }
        }),
    },
  ];

  React.useEffect(() => {
    didUserActivateSession().then((isSessionActive) => {
      if (!isSessionActive) {
        navigate("/login");
        return;
      }
      getSecretsSharedWithMe().then((secrets) => {
        setSecrets(secrets);
      });

      getUsers().then((users) => {
        setUsers(users);
      });
      setLoading(false);
    });
  }, [navigate]);

  const decryptLocalyWithPrivateKeyFile = () => {
    decryptSecretsWithPrivateKeyFile(privateKey, secrets).then((newSecrets) => {
      setDecryptedSecrets(newSecrets);
      setPrivateKey(null);
    });
  };

  const addSecretToSend = (e, secretName, secretValue, recipient) => {
    setSecretsReadyToShare([...secretsReadyToShare, { recipient, name: secretName, value: secretValue }]);
  };

  const sendSecrets = (e) => {
    shareSecrets(secretsReadyToShare).then((response) => {
      setSecretsReadyToShare([]);
    });
  };

  return (
    <ThemeProvider theme={mdTheme}>
      {isLoading ? (
        <LoadingSection />
      ) : (
        <Box sx={{ display: "flex" }}>
          <AppBarDrawerCombo
            drawerMenuItems={drawerMenuItems}
            drawerWidth={drawerWidth}
            tooltipMenuItems={tooltipMenuItems}
          />
          <Box
            component="main"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[900],
              flexGrow: 1,
              height: "100vh",
              overflow: "auto",
            }}
          >
            <Toolbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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
                    <SecretInfoForm
                      title="Secret Info"
                      autocompleteOptions={users}
                      buttonText="Add Secret"
                      buttonClicked={addSecretToSend}
                      clearAfterSubmit
                    />
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
                    <SecretsBreakdown secretsToShare={secretsReadyToShare} onButtonClick={sendSecrets} />
                  </Paper>
                </Grid>
                <Grid container spacing={0.5} item xs={12} direction="column">
                  <Grid item>
                    <Paper sx={{ p: 2, display: "flex", flexDirection: "column", minHeight: 200 }}>
                      <TableView
                        tableTitles={[
                          { text: "Identifier", mapping: "title" },
                          { text: "Secret Value", mapping: "secret", obfuscated: !decryptedSecrets?.length },
                        ]}
                        tableContent={decryptedSecrets?.length ? decryptedSecrets : secrets}
                        title="Secrets Shared With Me"
                      ></TableView>
                    </Paper>
                  </Grid>
                  <Grid item>
                    <Paper sx={{ p: 2, display: "flex" }}>
                      <FileUpload
                        selectFile={(e) => {
                          setPrivateKey(e.target?.files[0]);
                        }}
                        selectedFile={privateKey}
                        selectFileLabel="Select private key file"
                        uploadButtonLabel="Decrypt Secrets"
                        onSecondaryAction={decryptLocalyWithPrivateKeyFile}
                      ></FileUpload>
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>
              <Copyright sx={{ pt: 4 }} />
            </Container>
          </Box>
        </Box>
      )}
    </ThemeProvider>
  );
};

export default Dashboard;
