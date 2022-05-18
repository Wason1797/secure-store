import * as React from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemsWithIcon from "../menuItems/ListItemsWithIcon";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

const StyledDrawerContainer = (drawerWidth) =>
  styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(({ theme, open }) => ({
    "& .MuiDrawer-paper": {
      position: "relative",
      whiteSpace: "nowrap",
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: "border-box",
      ...(!open && {
        overflowX: "hidden",
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up("sm")]: {
          width: theme.spacing(9),
        },
      }),
    },
  }));
const Drawer = (props) => {
  const DrawerContainer = StyledDrawerContainer(props.drawerWidth);

  return (
    <DrawerContainer open={props.open} variant={props.variant}>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          px: [1],
        }}
      >
        <IconButton onClick={props.toggleDrawer}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List component="nav">
        {props.mainListItems?.length && <ListItemsWithIcon items={props.mainListItems} />}
        {props.secondaryListItems?.length && <Divider sx={{ my: 1 }} />}
        {props.secondaryListItems?.length && (
          <ListItemsWithIcon items={props.secondaryListItems} subheader={props.listSubheader} />
        )}
      </List>
    </DrawerContainer>
  );
};

Drawer.propTypes = {
  variant: PropTypes.string,
  drawerWidth: PropTypes.number,
  mainListItems: PropTypes.array,
  secondaryListItems: PropTypes.array,
  listSubheader: PropTypes.string,
  toggleDrawer: PropTypes.func,
};

export default Drawer;
