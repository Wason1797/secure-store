import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import Title from "../text/Title";
import PropTypes from "prop-types";

const SecretInfoForm = (props) => {
  const [secretName, setSecretName] = React.useState("");
  const [secretValue, setSecretValue] = React.useState("");
  const [recipient, setRecipient] = React.useState();
  const isFilled = () => secretName && secretValue && recipient;

  const onButtonClick = (e) => {
    props.buttonClicked(e, secretName, secretValue, recipient);
    if (props.clearAfterSubmit) {
      setSecretName("");
      setSecretValue("");
    }
  };

  return (
    <>
      <Title>{props.title}</Title>
      <Grid container item spacing={2} direction="column" justifyContent="space-between">
        <Grid item xs={3}>
          <Box display="flex" sx={{ pb: 2 }}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={props.autocompleteOptions || []}
              renderInput={(params) => <TextField {...params} label="Recipient" />}
              fullWidth
              onChange={(_e, value) => {
                setRecipient(value);
              }}
            />
          </Box>
        </Grid>
        <Divider />
        <Grid item xs={2}>
          <Box display="flex">
            <TextField
              label="Secret Name"
              fullWidth
              required
              onChange={(e) => {
                setSecretName(e.target.value);
              }}
              value={secretName}
            />
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Box display="flex">
            <TextField
              label="Secret Value"
              fullWidth
              required
              onChange={(e) => {
                setSecretValue(e.target.value);
              }}
              value={secretValue}
            />
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Box display="flex" justifyContent="flex-end">
            <Button onClick={onButtonClick} disabled={!isFilled()}>
              {props.buttonText}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

SecretInfoForm.propTypes = {
  title: PropTypes.string,
  autocompleteOptions: PropTypes.array,
  buttonText: PropTypes.string,
  buttonClicked: PropTypes.func,
  clearAfterSubmit: PropTypes.bool,
};

export default SecretInfoForm;
