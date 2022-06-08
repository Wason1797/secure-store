import React from "react";

import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

const createAlert = (title, message, highlight, severity = "info") => ({
  title,
  message,
  highlight,
  severity,
});

const AlertSection = (props) => {
  const [alerts, setAlerts] = React.useState(props.alerts || []);

  const { onAlertTimeout, clearTime } = props;

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setAlerts([]);
      onAlertTimeout();
    }, clearTime || 5000);

    return () => clearTimeout(timer);
  }, [clearTime, onAlertTimeout]);

  const alertsToShow = alerts.map((alert, index) => (
    <Grid item key={`${props.parentName}-alert-${index}`} xs={12}>
      <Alert severity={alert.severity}>
        <AlertTitle>{alert.title}</AlertTitle>
        {alert.message} <strong>{alert.highlight}</strong>
      </Alert>
    </Grid>
  ));

  return alerts.length ? (
    <Grid
      item
      container
      spacing={2}
      xs={12}
      sx={{
        maxHeight: "12vh",
        overflowY: "auto",
      }}
    >
      {alertsToShow}
    </Grid>
  ) : (
    <></>
  );
};

export default AlertSection;
export { createAlert };
