"use client";
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  CssBaseline,
  Box,
  Grid,
  Paper,
  Avatar,
  ListItemButton,
} from "@mui/material";
import Link from "next/link";

const drawerWidth = 240;

const layout = ({ children }: any) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <div className="sidebar-header">
        <Typography variant="h6" noWrap>
          Big Bux
        </Typography>
      </div>
      <List>
        {[
          { text: "Inventory", path: "/inventory" },
          { text: "Stats", path: "/statistics" },
        ].map((item) => (
          <ListItem key={item.text} disablePadding>
            <Link
              href={item.path}
              passHref
              style={{
                width: "100%",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <ListItemButton>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
    </div>
  );
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className="appbar"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            {/* <MenuIcon /> */}
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Avatar alt="Profile" src="https://via.placeholder.com/40" />
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Grid container spacing={2}>
          {[
            "3,256 Total Patients",
            "394 Available Staff",
            "$2,536 Avg Costs",
            "38 Available Cars",
          ].map((text, idx) => (
            <Grid key={idx} size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper className="stat-card">{text}</Paper>
            </Grid>
          ))}
        </Grid>
        <Box mt={4}>
          <Paper className="big-section">{children}</Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default layout;
