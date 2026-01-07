// src/components/Auth.tsx
import { Box, IconButton, Typography, Badge } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";

import { useGetMe, useLogout } from "../hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { useCart } from "../hooks/useCart";
function Auth() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: user, isLoading: userLoading } = useGetMe();

  // cart items for badge count
  const { data: cartItems = [] } = useCart();
  const cartCount = Array.isArray(cartItems) ? cartItems.length : 0;


  const handleLogout = () => {
    useLogout(); // removes tokens from localStorage
    qc.clear();
    navigate("/");
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: "10px",
        zIndex: 3,
        alignItems: "center",
      }}
    >
      {/* Authenticated */}
      {user ? (
        <>
          <IconButton onClick={handleLogout} color="inherit" title="Logout">
            <LogoutIcon />
          </IconButton>

          <Link to="/myorders" style={{ textDecoration: "none" }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                fontWeight: "bold",
                color: "var(--text-color)",
                border: "1px solid var(--navbar-border-color)",
                borderRadius: "5px",
                background: "var(--background-color)",
                padding: "4px 10px",
                gap: 1,
              }}
            >
              Мой заказ
            </Typography>
          </Link>

          <Link to="/profile" style={{ textDecoration: "none" }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                fontWeight: "bold",
                color: "var(--text-color)",
                border: "1px solid var(--navbar-border-color)",
                borderRadius: "5px",
                background: "var(--background-color)",
                padding: "4px 10px",
                gap: 1,
              }}
            >
              {user.first_name ?? user.phone ?? "Profile"}
            </Typography>
          </Link>

          <Box component={Link} to="/cart" sx={{ color: "inherit", textDecoration: "none" }}>
            <Badge badgeContent={cartCount} color="error">
              <ShoppingCartIcon sx={{ color: "var(--text-color)" }} />
            </Badge>
          </Box>
        </>
      ) : (
        // Not authenticated
        <>
          <Link to="/login" style={{ textDecoration: "none" }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontSize: "20px",
                display: "flex",
                alignItems: "center",
                fontWeight: "bold",
                color: "var(--text-color)",
                border: "1px solid var(--navbar-border-color)",
                borderRadius: "5px",
                background: "var(--background-color)",
                padding: "2px 6px",
                gap: 1,
              }}
            >
              <LoginIcon />
              Login
            </Typography>
          </Link>

          <Link to="/signUp" style={{ textDecoration: "none" }}>
            <Typography
              variant="subtitle1"
              sx={{
                display: "flex",
                fontSize: "20px",
                background: "var(--background-color)",
                alignItems: "center",
                color: "var(--text-color)",
                fontWeight: "bold",
                border: "1px solid var(--navbar-border-color)",
                padding: "2px 6px",
                borderRadius: "5px",
                gap: 1,
              }}
            >
              <PersonAddAltIcon />
              Sign up
            </Typography>
          </Link>

          <Box component={Link} to="/cart" sx={{ color: "inherit", textDecoration: "none" }}>
            <Badge badgeContent={cartCount} color="error">
              <ShoppingCartIcon sx={{ color: "var(--text-color)", ml: 1 }} />
            </Badge>
          </Box>
        </>
      )}
    </Box>
  );
}

export default Auth;
