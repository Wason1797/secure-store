import * as React from "react";
import { useNavigate } from "react-router-dom";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { ThemeProvider } from "@mui/material/styles";

import TableView from "../components/controls/TableView";
import FileUpload from "../components/controls/FileUpload";
import LoadingSection from "../components/sections/LoadingSection";
import SecretInfoForm from "../components/sections/SecretInfoForm";
import SecretsBreakdown from "../components/sections/SecretsBreakdown";
import SecureStorePageLayout from "../components/layout/SecureStorePageLayout";

import { getUsers, didUserActivateSession } from "../services/api/users";
import { decryptSecretsWithPrivateKeyFile } from "../services/crypto/rsaFunctions";
import { getSecretsSharedWithMe, shareSecrets, performKeyAgreement } from "../services/api/secrets";

const Dashboard = (props) => {
  const [users, setUsers] = React.useState([]);
  const [secrets, setSecrets] = React.useState([]);
  const [isLoading, setLoading] = React.useState(true);
  const [activeUser, setActiveUser] = React.useState(null);
  const [privateKey, setPrivateKey] = React.useState(null);
  const [decryptedSecrets, setDecryptedSecrets] = React.useState([]);
  const [secretsReadyToShare, setSecretsReadyToShare] = React.useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    didUserActivateSession().then((activeUser) => {
      if (!activeUser) {
        navigate("/login");
        return;
      }

      getSecretsSharedWithMe().then((secrets) => {
        setSecrets(secrets);
      });

      getUsers().then((users) => {
        setUsers(users?.map((user) => user.user_email));
      });
      setActiveUser(activeUser);
      setLoading(false);
    });
  }, [navigate]);

  const decryptLocalyWithPrivateKeyFile = async (onProgress) => {
    const newSecrets = await decryptSecretsWithPrivateKeyFile(privateKey, secrets);
    setDecryptedSecrets(newSecrets);
    setPrivateKey(null);
  };

  const addSecretToSend = (e, secretName, secretValue, recipient) => {
    setSecretsReadyToShare([...secretsReadyToShare, { recipient, name: secretName, value: secretValue }]);
  };

  const sendSecrets = (e) => {
    const secureSecretSharing = async () => {
      const sharedSecret = await performKeyAgreement();
      return shareSecrets(secretsReadyToShare, sharedSecret);
    };

    secureSecretSharing().then((response) => {
      if (response?.length > 0) {
        getSecretsSharedWithMe().then((secrets) => {
          setSecrets(secrets);
        });
        setSecretsReadyToShare([]);
      }
    });
  };

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
                      { text: "Identifier", mapping: "secret_id" },
                      { text: "Secret Value", mapping: "secret", obfuscated: !decryptedSecrets?.length },
                      { text: "Timestamp", mapping: "created_at" },
                      { text: "Sender Email", mapping: "sender_email" },
                    ]}
                    toolbarButtons={[
                      {
                        icon: "VisibilityOff",
                        ariaLabel: "Stop showing secrets",
                        disabled: !decryptedSecrets?.length,
                        onClick: () => setDecryptedSecrets([]),
                      },
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
        </SecureStorePageLayout>
      )}
    </ThemeProvider>
  );
};

export default Dashboard;
