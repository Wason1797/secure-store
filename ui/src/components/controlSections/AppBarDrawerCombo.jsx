import React from "react";
import PropTypes from "prop-types";
import AppBar from "../controls/AppBar";
import Drawer from "../controls/Drawer";

const AppBarDrawerCombo = (props) => {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <>
      <AppBar
        position="absolute"
        open={open}
        toggleDrawer={toggleDrawer}
        drawerWidth={props.drawerWidth}
        tooltipMenuItems={props.tooltipMenuItems}
        avatarName="WB"
      />
      <Drawer
        variant="permanent"
        open={open}
        mainListItems={props.drawerMenuItems}
        toggleDrawer={toggleDrawer}
        drawerWidth={props.drawerWidth}
      ></Drawer>
    </>
  );
};

AppBarDrawerCombo.propTypes = {
  drawerWidth: PropTypes.number,
  drawerMenuItems: PropTypes.array,
  tooltipMenuItems: PropTypes.array,
};

export default AppBarDrawerCombo;
