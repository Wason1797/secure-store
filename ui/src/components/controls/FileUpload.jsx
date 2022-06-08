import React from "react";

import { withStyles } from "@material-ui/core";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";

import IconMapping from "../mappings/iconMappings";

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 15,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor: "#EEEEEE",
  },
  bar: {
    borderRadius: 5,
    backgroundColor: "#1a90ff",
  },
}))(LinearProgress);

const FileUpload = (props) => {
  const FileIcon = IconMapping[props.customIcon || "UploadFileIcon"];

  const [progress, setProgress] = React.useState(0);

  const trackProgress = (event) => {
    setProgress(Math.round((100 * event.loaded) / event.total));
  };

  return (
    <Grid container direction="column" spacing={0}>
      <Grid container item spacing={2} alignItems="center">
        <Grid item xs={4}>
          <label htmlFor="btn-upload">
            <input
              id="btn-upload"
              name="btn-upload"
              style={{ display: "none" }}
              type="file"
              onChange={props.selectFile}
              multiple={false}
            />
            <IconButton component="span" edge="start" color="inherit" variant="outlined">
              <FileIcon sx={{ mr: 1 }} />
              <Typography variant="body2" color="inherit">
                {props.selectFileLabel}
              </Typography>
            </IconButton>
          </label>
        </Grid>
        <Grid item xs={4}>
          <Box display="flex" justifyContent="center">
            <Typography align="left" variant="h6" color="textPrimary">
              {props.selectedFile ? `Your file: ${props.selectedFile.name}` : null}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box display="flex" justifyContent="flex-end">
            <Button
              className="btn-upload"
              color="primary"
              variant="contained"
              component="span"
              disabled={!props.selectedFile}
              onClick={() =>
                props.onSecondaryAction(trackProgress).then((result) => {
                  setProgress(0);
                  if (result) {
                    props?.setAlert();
                  }
                }) || (() => {})
              }
            >
              {props.uploadButtonLabel}
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Grid container item spacing={2} alignItems="center">
        <Grid item xs={9}>
          {props.selectedFile && props.reportsProgress && progress ? (
            <Box display="flex" alignItems="center">
              <Box>
                <BorderLinearProgress variant="determinate" value={progress} />
              </Box>
              <Box minWidth={35}>
                <Typography variant="body2" color="textSecondary">{`${progress}%`}</Typography>
              </Box>
            </Box>
          ) : null}
        </Grid>
        <Grid item xs={3}>
          <Typography
            variant="subtitle2"
            className={`upload-message ${props.hasUploadError ? "error" : ""}`}
            color="error"
          >
            {props.errorMessage}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default FileUpload;
