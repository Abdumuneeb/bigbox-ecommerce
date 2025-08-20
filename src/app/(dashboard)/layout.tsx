"use client";
import React, { useEffect, useState } from "react";
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
  Paper,
  Avatar,
  ListItemButton,
  Menu,
  MenuItem,
} from "@mui/material";
import Link from "next/link";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";

const drawerWidth = 240;

const layout = ({ children }: any) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const initial = name?.charAt(0).toUpperCase() || "";
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Client-side cookie access
    const nameCookie = Cookies.get("name");
    const emailCookie = Cookies.get("email");
    setName(nameCookie || "");
    setEmail(emailCookie || "");
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    Cookies.remove("name");
    Cookies.remove("email");
    Cookies.remove("token");
    Cookies.remove("id");
    router.push("/login");
  };

  const drawer = (
    <div>
      <div className="sidebar-header">
        <Typography variant="h6" noWrap>
          Bug Box
        </Typography>
      </div>
      <List
        sx={{
          paddingRight: "2rem",
        }}
      >
        {[
          { text: "Inventory", path: "/inventory" },
          { text: "Analytics", path: "/statistics" },
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
              <ListItemButton
                sx={{
                  backgroundColor:
                    pathname === item.path ? "#1f5b51" : "transparent",
                  color: pathname === item.path ? "white" : "inherit",
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor:
                      pathname === item.path ? "#1f5b51" : "rgba(0,0,0,0.08)",
                  },
                }}
              >
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
          {/* <Avatar alt="Profile" src="https://via.placeholder.com/40" /> */}

          <Box ml={2}>
            <IconButton onClick={handleMenuOpen} size="small">
              <Avatar sx={{ bgcolor: "#1976d2", width: 40, height: 40 }}>
                {initial}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                elevation: 3,
                sx: {
                  borderRadius: 2,
                  minWidth: 220,
                  p: 1,
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <Box px={2} py={1}>
                <Typography fontWeight={600}>{name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {email}
                </Typography>
              </Box>

              <List sx={{ p: 0 }}>
                {[
                  { text: "Inventory", path: "/inventory" },
                  { text: "Analytics", path: "/statistics" },
                ].map((item) => (
                  <ListItem
                    key={item.text}
                    disablePadding
                    sx={{ pl: 0 }} // <-- removes left padding
                  >
                    <Link
                      href={item.path}
                      passHref
                      style={{
                        width: "100%",
                        textDecoration: "none",
                        color: "inherit",
                      }}
                    >
                      <ListItemButton sx={{ borderRadius: "8px" }}>
                        <ListItemText primary={item.text} />
                      </ListItemButton>
                    </Link>
                  </ListItem>
                ))}
              </List>

              <MenuItem
                onClick={handleLogout}
                sx={{ mt: 1, borderTop: "1px solid #eee" }}
              >
                Logout
              </MenuItem>
            </Menu>
          </Box>
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
        <Box mt={4}>
          <Paper className="big-section">{children}</Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default layout;
