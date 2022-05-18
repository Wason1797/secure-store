import React from "react";
import PropTypes from "prop-types";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import IconMapping from "../mappings/iconMappings";

const ListItemsWithIcon = (props) => {
  const content = props?.items
    ? props.items.map((item, index) => {
        const Icon = IconMapping[item.icon];
        return (
          <ListItemButton key={`${index}-${item.text}-iconItem`} onClick={item.onClick || (() => {})}>
            <ListItemIcon>
              <Icon />
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        );
      })
    : null;

  return (
    <>
      {props.subheader && (
        <ListSubheader component="div" inset>
          {props.subheader}
        </ListSubheader>
      )}
      {content}
    </>
  );
};

ListItemsWithIcon.propTypes = {
  subheader: PropTypes.string,
  items: PropTypes.array,
};

export default ListItemsWithIcon;
