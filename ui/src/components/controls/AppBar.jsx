import * as React from "react";
import PropTypes from "prop-types";

import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Toolbar from "@mui/material/Toolbar";
import MuiAppBar from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import NotificationsIcon from "@mui/icons-material/Notifications";

import TooltipMenu from "./TooltipMenu";

const StyledAppBarContainer = (drawerWidth) =>
  styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
  })(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }));

const AppBar = (props) => {
  const AppBarContainer = StyledAppBarContainer(props.drawerWidth);

  return (
    <AppBarContainer position={props.position} open={props.open}>
      <Toolbar
        sx={{
          pr: "24px", // keep right padding when drawer closed
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={props.toggleDrawer}
          sx={{
            marginRight: "36px",
            ...(props.open && { display: "none" }),
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
          Secure Store
        </Typography>
        {props.notificationCount && (
          <IconButton color="inherit">
            <Badge badgeContent={props.notificationCount} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        )}
        {(props.avatarImgSrc || props.avatarName) && (
          <TooltipMenu
            menuId="tooltip-menu"
            items={props.tooltipMenuItems|| []}
            tooltipTitle="Account Settings"
          >
            <Avatar src={props.avatarImgSrc || ""}>{props.avatarName}</Avatar>
          </TooltipMenu>
        )}
      </Toolbar>
    </AppBarContainer>
  );
};

AppBar.propTypes = {
  drawerWidth: PropTypes.number,
  position: PropTypes.string,
  notificationCount: PropTypes.number,
  toggleDrawer: PropTypes.func,
  open: PropTypes.bool,
  tooltipMenuItems: PropTypes.array
};

export default AppBar;
