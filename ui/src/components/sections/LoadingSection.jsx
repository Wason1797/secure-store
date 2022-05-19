import React from "react";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";

const LoadingSection = () => {
  return (
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
        <CircularProgress size="25vh" thickness={2.5}/>
      </Grid>
    </Grid>
  );
};

export default LoadingSection;
