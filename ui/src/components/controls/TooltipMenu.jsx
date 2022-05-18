import React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconMapping from "../mappings/iconMappings";


const TooltipMenu = (props) => {
  const [tooltipMenuAnchor, setTtooltipMenuAnchor] = React.useState(null);
  const open = Boolean(tooltipMenuAnchor);
  const onTooltipMenuClose = () => setTtooltipMenuAnchor(null);
  const onIconClick = (event) => setTtooltipMenuAnchor(event.currentTarget);
  return (
    <>
      <Tooltip title={props.tooltipTitle}>
        <IconButton
          onClick={onIconClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? props.menuId : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          {props.children}
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={tooltipMenuAnchor}
        id={props.menuId}
        open={open}
        onClose={onTooltipMenuClose}
        onClick={onTooltipMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {props?.items.map((item, index) => {
          const Icon = IconMapping[item.icon];
          return (
            <MenuItem key={`tooltipMenuItem-${index}`} onClick={item.onClick || (() => {})}>
              <ListItemIcon>
                <Icon fontSize="small" />
              </ListItemIcon>
              {item.title}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

export default TooltipMenu;
