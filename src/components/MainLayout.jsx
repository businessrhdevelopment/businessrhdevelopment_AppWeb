import React from "react";
import { Outlet } from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import Sidebar from "./Sidebar/Sidebar";

const MainLayout = () => {
  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f4f4f4", overflow: "hidden" }}>
      <CssBaseline />
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 2, overflow: "auto" }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
