import * as React from "react";
import { useNavigate } from "react-router-dom";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { ThemeProvider } from "@mui/material/styles";

import FileUpload from "../components/controls/FileUpload";
import AlertSection from "../components/sections/AlertSection";
import { createAlert } from "../components/sections/AlertSection";
import LoadingSection from "../components/sections/LoadingSection";
import SecureStorePageLayout from "../components/layout/SecureStorePageLayout";

import { uploadPublicKey } from "../services/api/publicKey";
import { didUserActivateSession } from "../services/api/users";

const UpdateUserKey = (props) => {
  const [isLoading, setLoading] = React.useState(true);
  const [activeUser, setActiveUser] = React.useState(null);
  const [publicKeyFile, setPublicKeyFile] = React.useState(null);
  const [alerts, setAlerts] = React.useState([]);

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

  const addAlert = (title, message, highlight, severity) => {
    const alert = createAlert(title, message, highlight, severity);
    setAlerts([...alerts, alert]);
  };

  return (
    <ThemeProvider theme={props.mdTheme}>
      {isLoading ? (
        <LoadingSection />
      ) : (
        <SecureStorePageLayout avatarImgSrc={activeUser.picture}>
          <Grid container direction="column" spacing={1}>
            {alerts.length ? (
              <AlertSection alerts={alerts} onAlertTimeout={() => setAlerts([])} parentName="updateUserKey" />
            ) : null}
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
                <FileUpload
                  selectFile={(e) => {
                    setPublicKeyFile(e.target?.files[0]);
                  }}
                  selectedFile={publicKeyFile}
                  selectFileLabel="Select a new public key file"
                  uploadButtonLabel="Upload new public Key"
                  onSecondaryAction={(onUploadProgress) =>
                    uploadPublicKey(publicKeyFile, onUploadProgress, () => {
                      setPublicKeyFile(null);
                    })
                  }
                  setAlert={(result) => {
                    const message = result ? "Public Key Stored correctly" : "Error while storing your public key";
                    addAlert("File Upload", message, null, result ? "success" : "error");
                  }}
                  reportsProgress
                />
              </Paper>
            </Grid>
          </Grid>
        </SecureStorePageLayout>
      )}
    </ThemeProvider>
  );
};

export default UpdateUserKey;
