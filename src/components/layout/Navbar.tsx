"use client";

import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { axiosInstances } from "@/services/axiosService";
import { api } from "@/services/api";

const Navbar = () => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [orderCount, setOrderCount] = useState(0);
  const userId = Cookies.get("id");

  const getCartItems = async () => {
    try {
      const result = await axiosInstances.get(api.getOrders(userId));
      if (result.status === 200) {
        setOrderCount(result.data.length);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };
  useEffect(() => {
    // Initial fetch from API
    getCartItems();

    const nameCookie = Cookies.get("name");
    const emailCookie = Cookies.get("email");
    setName(nameCookie || "");
    setEmail(emailCookie || "");

    // Sync when cartCount cookie changes
    const syncCartCount = () => {
      const cookieCount = Cookies.get("cartCount");
      if (cookieCount) {
        setOrderCount(Number(cookieCount));
      }
    };

    // Run once immediately
    syncCartCount();

    // Listen to changes across tabs/windows
    window.addEventListener("storage", syncCartCount);

    return () => {
      window.removeEventListener("storage", syncCartCount);
    };
  }, []);

  useEffect(() => {
    Cookies.set("cartCount", orderCount.toString());
  }, [orderCount]);

  const initial = name?.charAt(0).toUpperCase() || "";

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

  return (
    <div className="container-fluid sticky-top">
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-dark p-0">
          <Link href="/home" className="navbar-brand">
            <img className="img-fluid" src="/images/logo.png" alt="Logo" />
          </Link>
          <button
            type="button"
            className="navbar-toggler ms-auto me-0"
            data-bs-toggle="collapse"
            data-bs-target="#navbarCollapse"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <div className="navbar-nav ms-auto">{/*  */}</div>
          </div>

          {/* Cart Icon */}
          <Link
            href="/cart"
            className="nav-link position-relative p-0"
            style={{ color: "#fff" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: "35px" }}
              className="ionicon"
              viewBox="0 0 512 512"
            >
              <circle
                cx="176"
                cy="416"
                r="16"
                fill="none"
                stroke="#fff"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="32"
              />
              <circle
                cx="400"
                cy="416"
                r="16"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="32"
              />
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="32"
                d="M48 80h64l48 272h256"
              />
              <path
                d="M160 288h249.44a8 8 0 007.85-6.43l28.8-144a8 8 0 00-7.85-9.57H128"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="32"
              />
            </svg>
            <span className="position-absolute top-4 start-100 translate-middle badge rounded-pill bg-danger">
              {orderCount}
            </span>
          </Link>

          {/* Avatar with Menu */}
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
              <MenuItem
                onClick={handleLogout}
                sx={{ mt: 1, borderTop: "1px solid #eee" }}
              >
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
