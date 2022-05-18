import React from "react";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TableView from "../controls/TableView";

const SecretsBreakdown = (props) => {
  return (
    <Grid container item spacing={2} direction="column" justifyContent="space-between">
      <Grid item xs={6}>
        <TableView
          tableTitles={[
            { text: "Recipient", mapping: "recipient" },
            { text: "Secret Name", mapping: "name" },
            { text: "Secret Value", mapping: "value", obfuscated: true },
          ]}
          tableContent={props.secretsToShare}
          title="Secrets Ready To Share"
        ></TableView>
      </Grid>
      <Grid item xs={2}>
        <Box display="flex" justifyContent="flex-end">
          <Button onClick={props.onButtonClick} disabled={!props?.secretsToShare?.length > 0}>
            Share Secrets
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

SecretsBreakdown.propTypes = {
  secretsToShare: PropTypes.array,
  onButtonClick: PropTypes.func,
};

export default SecretsBreakdown;
