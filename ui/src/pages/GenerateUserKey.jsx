import * as React from "react";
import { useNavigate } from "react-router-dom";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import Autocomplete from "@mui/material/Autocomplete";
import { ThemeProvider } from "@mui/material/styles";

import LoadingSection from "../components/sections/LoadingSection";
import HiddenAutoDownload from "../components/controls/HiddenAutoDownload";
import SecureStorePageLayout from "../components/layout/SecureStorePageLayout";

import { uploadPublicKey } from "../services/api/publicKey";
import { didUserActivateSession } from "../services/api/users";
import { generateRSAKeyPair } from "../services/crypto/rsaFunctions";

const GenerateUserKey = (props) => {
  const [isLoading, setLoading] = React.useState(true);
  const [activeUser, setActiveUser] = React.useState(null);
  const [keyLength, setKeyLength] = React.useState(4096);
  const [rsaPublicKey, setRsaPublicKey] = React.useState("");
  const [rsaPublicKeyDownloadUrl, setRsaPublicKeyDonwloadUrl] = React.useState(null);
  const [rsaPrivateKey, setRsaPrivateKey] = React.useState("");
  const [rsaPrivateKeyDonwloadUrl, setRsaPrivateKeyDonwloadUrl] = React.useState(null);
  const [isKeyLoading, setIsKeyLoading] = React.useState(false);

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
                maxHeight: "100vh",
                width: "100%",
              }}
            >
              <Grid item container xs={12} direction="column" spacing={6}>
                <Grid item container spacing={2} xs={2} alignItems="center">
                  <Grid item>
                    <Autocomplete
                      disablePortal
                      defaultValue={"4096"}
                      id="key-length-select"
                      options={["4096", "2048", "1024"]}
                      sx={{ minWidth: 200 }}
                      renderInput={(params) => <TextField {...params} label="Key Length" contentEditable={false} />}
                      onChange={(_e, value) => setKeyLength(parseInt(value, 10))}
                    />
                  </Grid>
                  <Grid item>
                    <LoadingButton
                      disabled={!keyLength || (rsaPublicKey !== "" && rsaPrivateKey !== "")}
                      className="btn-upload"
                      loading={isKeyLoading}
                      color="primary"
                      variant="contained"
                      component="span"
                      onClick={() => {
                        setIsKeyLoading(true);
                        generateRSAKeyPair(keyLength).then((rsaKeyPair) => {
                          setRsaPrivateKey(rsaKeyPair.rsaPrivateKey);
                          setRsaPublicKey(rsaKeyPair.rsaPublicKey);
                          setIsKeyLoading(false);
                        });
                      }}
                    >
                      Generate Key Pair
                    </LoadingButton>
                    <HiddenAutoDownload
                      downloadName="privateKey.p8"
                      downloadUrl={rsaPrivateKeyDonwloadUrl}
                      onCleanup={() => setRsaPrivateKeyDonwloadUrl(null)}
                    />
                    <HiddenAutoDownload
                      downloadName="publicKey.pub"
                      downloadUrl={rsaPublicKeyDownloadUrl}
                      onCleanup={() => setRsaPublicKeyDonwloadUrl(null)}
                    />
                  </Grid>
                  <Grid item>
                    <Button
                      className="btn-upload"
                      disabled={rsaPublicKey === "" && rsaPrivateKey === ""}
                      color="primary"
                      variant="contained"
                      component="span"
                      onClick={() => {
                        const pubKeyBlob = new Blob([rsaPublicKey]);
                        const privKeyBlob = new Blob([rsaPrivateKey]);
                        uploadPublicKey(
                          new File([pubKeyBlob], "publicKey.pub"),
                          () => {},
                          () => {}
                        ).then((uploadResult) => {
                          setRsaPublicKeyDonwloadUrl(URL.createObjectURL(pubKeyBlob));
                          setRsaPrivateKeyDonwloadUrl(URL.createObjectURL(privKeyBlob));
                          setRsaPrivateKey("");
                          setRsaPublicKey("");
                        });
                      }}
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
                      maxRows={15}
                      fullWidth
                      value={rsaPrivateKey}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      id="rsa-pub-key"
                      label="Public Key"
                      variant="outlined"
                      multiline
                      minRows={15}
                      maxRows={15}
                      fullWidth
                      value={rsaPublicKey}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ readOnly: true }}
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
