import React from "react";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import UpdateUserKey from "./pages/UpdateUserKey";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/update-user-key" element={<UpdateUserKey />} />
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
