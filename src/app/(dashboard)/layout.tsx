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
  Avatar,
  ListItemButton,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  Paper,
} from "@mui/material";
import Link from "next/link";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";

const drawerWidth = 270;

// ✅ Inline SVG icons
const InventoryIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="20"
    width="20"
    fill="currentColor"
  >
    <path d="M4 6V4q0-.825.588-1.413Q5.175 2 6 2h8q.825 0 1.413.587Q16 3.175 16 4v2zM6 18q-.825 0-1.413-.587Q4 16.825 4 16V8h12v8q0 .825-.587 1.413Q14.825 18 14 18z" />
  </svg>
);

const BarChartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="20"
    width="20"
    fill="currentColor"
  >
    <path d="M5 17h2V7H5zm6 0h2V3h-2zm6 0h2v-8h-2z" />
  </svg>
);

const LogoutIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="20"
    width="20"
    fill="currentColor"
  >
    <path d="M10.8 17v-2H16V9h-5.2V7H18v10ZM4 20q-.825 0-1.413-.587Q2 18.825 2 18V6q0-.825.587-1.413Q3.175 4 4 4h6v2H4v12h6v2Z" />
  </svg>
);

const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24"
    width="24"
    fill="currentColor"
  >
    <path d="M3 18h18v-2H3zm0-5h18v-2H3zm0-5h18V6H3z" />
  </svg>
);

const Layout = ({ children }: any) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const initial = name?.charAt(0).toUpperCase() || "";
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const nameCookie = Cookies.get("name");
    const emailCookie = Cookies.get("email");
    setName(nameCookie || "");
    setEmail(emailCookie || "");
  }, []);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    Cookies.remove("name");
    Cookies.remove("email");
    Cookies.remove("token");
    Cookies.remove("id");
    router.push("/login");
  };

  const drawer = (
    <div>
      <div>
        <Box
          sx={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: "40px",
            paddingBottom: "10px",
          }}
        >
          <Avatar
            sx={{
              bgcolor: "var(--primary)",
              width: 50,
              height: 50,
              marginBottom: "10px",
            }}
          >
            {initial}
          </Avatar>
          <Typography sx={{ marginBottom: "0 !important" }}>
            {" "}
            {name}{" "}
          </Typography>
          <Typography> {email} </Typography>
        </Box>
      </div>
      <Divider />
      <List>
        {[
          { text: "Inventory", path: "/inventory", icon: <InventoryIcon /> },
          { text: "Analytics", path: "/statistics", icon: <BarChartIcon /> },
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
                    pathname === item.path ? "var(--primary)" : "transparent",
                  color: pathname === item.path ? "#fff" : "inherit",
                  borderRadius: "8px",
                  m: 0.5,
                  "&:hover": {
                    backgroundColor:
                      pathname === item.path
                        ? "var(--primary)"
                        : "rgba(18,107,119,0.08)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: pathname === item.path ? "#fff" : "var(--primary)",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "#DCF2FB",
        heigh: "100vh !important",
      }}
    >
      <CssBaseline />
      <AppBar position="fixed" className="appbar">
        <Toolbar>
          {/* Hamburger always visible on xs, sm, md */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              display: { xs: "block", sm: "block", md: "block", lg: "none" },
            }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton onClick={handleMenuOpen} size="small">
            <Avatar sx={{ bgcolor: "var(--primary)", width: 40, height: 40 }}>
              {initial}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              elevation: 3,
              sx: { borderRadius: 2, minWidth: 220, p: 1 },
            }}
          >
            <Box px={2} py={1}>
              <Typography fontWeight={600}>{name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {email}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <LogoutIcon /> Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{
          width: { xs: 0, md: drawerWidth },
          flexShrink: { sm: 0 },
        }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", lg: "none" },
            "& .MuiDrawer-paper": { width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { xs: `calc(100% - ${drawerWidth}px)`, md: "100%" },
          height: "100vh",
        }}
      >
        <Toolbar />
        <Paper className="big-section">{children}</Paper>
      </Box>
    </Box>
  );
};

export default Layout;
