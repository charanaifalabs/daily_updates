import React from "react";
import { AppBar, Toolbar, Typography, Button, Box, Chip } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const AppBarHeader: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "error";
      case "librarian":
        return "warning";
      default:
        return "primary";
    }
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Book Management System
          </Typography>
        </Box>

        {user && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Chip
              label={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              color={getRoleColor(user.role)}
              variant="outlined"
              sx={{
                color: "white",
                border: "2px solid white",
                fontWeight: 600,
              }}
            />

            <Typography variant="body2" color="white">
              {user.name}
            </Typography>

            <Button
              variant="outlined"
              onClick={handleLogout}
              sx={{
                color: "white",
                border: "2px solid white",
                "&:hover": {
                  borderColor: "error.dark",
                  backgroundColor: "error.light",
                },
              }}
            >
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default AppBarHeader;
