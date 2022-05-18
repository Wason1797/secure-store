import React from "react";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

const Copyright = (props) => {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {"Copyright © "}
      <Link color="inherit" href={props.goTo}>
        {props.websiteTitle}
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

Copyright.propTypes = {
  websiteTitle: PropTypes.string,
};

export default Copyright;
