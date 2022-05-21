import * as React from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";

import Copyright from "../text/Copyright";
import AppBarDrawerCombo from "../sections/AppBarDrawerCombo";

import { logoutUserSession } from "../../services/api/auth";

const SecureStorePageLayout = (props) => {
  const navigate = useNavigate();

  const tooltipMenuItems = [
    {
      title: "Logout",
      icon: "Logout",
      onClick: () =>
        logoutUserSession().then((didLogout) => {
          if (didLogout) {
            navigate("/login");
          }
        }),
    },
  ];
  const drawerMenuItems = [
    {
      text: "Share Secrets",
      icon: "Dashboard",
      onClick: () => navigate("/dashboard"),
    },
    {
      text: "Update Public Key",
      icon: "Key",
      onClick: () => navigate("/update-user-key"),
    },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <AppBarDrawerCombo
        drawerMenuItems={props.drawerMenuItems || drawerMenuItems}
        drawerWidth={240}
        tooltipMenuItems={props.tooltipMenuItems || tooltipMenuItems}
        avatarImgSrc={props.avatarImgSrc}
      />
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[900],
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {props.children}
          <Copyright sx={{ pt: 4 }} />
        </Container>
      </Box>
    </Box>
  );
};

export default SecureStorePageLayout;
