import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  Alert,
  Paper,
  InputAdornment,
  IconButton,
  Divider,
  Stack,
  Chip,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { registerUser, clearError } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

type RoleType = "user" | "librarian" | "admin";

const Register: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useAppSelector((s) => s.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"user" | "librarian" | "admin">("user");
  const [showSuccess, setShowSuccess] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    dispatch(registerUser({ name, email, password, role }));
    setShowSuccess(true);
  };

  const handleLoginRedirect = () => {
    console.log("Navigating to login page...");
    navigate("/login");
  };

  const getRoleIcon = (roleType: RoleType) => {
    switch (roleType) {
      case "admin":
        return <>Admin</>;
      case "librarian":
        return <>Librarian</>;
      default:
        return <>User</>;
    }
  };

  const getRoleColor = (roleType: RoleType) => {
    switch (roleType) {
      case "admin":
        return "error";
      case "librarian":
        return "warning";
      default:
        return "primary";
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: "100%",
            borderRadius: 2,
          }}
        >
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <span style={{ fontSize: 30, marginBottom: 16, color: "#1976d2" }}>
              Register
            </span>
            <Typography variant="body1" color="text.secondary">
              Join our book management system today
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {showSuccess && user && !loading ? (
            <Alert severity="success" sx={{ mb: 3 }}>
              Registration successful! You can now sign in with your
              credentials.
            </Alert>
          ) : null}

          <Box component="form" onSubmit={submit} noValidate>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Full Name"
                value={name}
                placeholder="Enter Full Name"
                onChange={(e) => setName(e.target.value)}
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <span style={{ color: "#666" }}></span>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Email Address"
                placeholder="Enter Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <span style={{ color: "#666" }}></span>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="Enter Password"
                onChange={(e) => setPassword(e.target.value)}
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <span style={{ color: "#666" }}></span>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        <Typography
                          variant="caption"
                          color="primary"
                          sx={{ cursor: "pointer" }}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? "Hide" : "Show"}
                        </Typography>
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                select
                label="Select Role"
                value={role}
                onChange={(e) => setRole(e.target.value as RoleType)}
                variant="outlined"
              >
                <MenuItem value="user">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    User
                  </Box>
                </MenuItem>
                <MenuItem value="librarian">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    Librarian
                  </Box>
                </MenuItem>
                <MenuItem value="admin">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    Admin
                  </Box>
                </MenuItem>
              </TextField>

              <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <Chip
                  icon={getRoleIcon(role)}
                  label={`Selected: ${
                    role.charAt(0).toUpperCase() + role.slice(1)
                  }`}
                  color={getRoleColor(role)}
                  variant="outlined"
                />
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                size="large"
                sx={{ mt: 2, mb: 2 }}
              >
                {loading ? "Registering..." : "Register"}
              </Button>
            </Stack>
          </Box>

          <br></br>

          {user && !loading && (
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Button
                variant="contained"
                color="success"
                onClick={handleLoginRedirect}
              >
                Go to Login
              </Button>
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Already have an account?
            </Typography>
            <Button variant="outlined" onClick={handleLoginRedirect}>
              Sign In
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
