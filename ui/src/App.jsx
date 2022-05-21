import React from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UpdateUserKey from "./pages/UpdateUserKey";
import { createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  const mdTheme = createTheme();
  const LoginPage = <Login mdTheme={mdTheme}/>;
  return (
    <Router>
      <CssBaseline />
      <Routes>
        <Route path="/dashboard" element={<Dashboard mdTheme={mdTheme} />} />
        <Route path="/update-user-key" element={<UpdateUserKey mdTheme={mdTheme}/>} />
        <Route path="/" element={LoginPage} />
        <Route path="/login" element={LoginPage} />
      </Routes>
    </Router>
  );
};

export default App;
