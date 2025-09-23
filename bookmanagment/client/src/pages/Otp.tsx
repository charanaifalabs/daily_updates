import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Paper,
  InputAdornment,
  Divider,
  Stack,
  CircularProgress,
  Chip,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { verifyOtp, clearError } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const OtpPage: React.FC = () => {
  const [otp, setOtp] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { otpVerified, emailForOtp, user, loading, error } = useAppSelector(
    (state) => state.auth
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailForOtp) {
      console.error("No email for OTP found");
      return;
    }

    dispatch(clearError());
    console.log("Submitting OTP:", { email: emailForOtp, otp });
    const res = await dispatch(verifyOtp({ email: emailForOtp, otp }));

    console.log("OTP verification result:", res);
    if (res.meta.requestStatus === "fulfilled") {
      console.log("OTP verification successful");
    } else {
      console.error("OTP verification failed:", res.payload);
    }
  };

  // Redirect based on role after OTP verification
  useEffect(() => {
    if (otpVerified && user) {
      console.log("Redirecting user to dashboard:", { role: user.role, user });
      switch (user.role) {
        case "admin":
          console.log("Redirecting to admin dashboard");
          navigate("/admin");
          break;
        case "librarian":
          console.log("Redirecting to librarian dashboard");
          navigate("/librarian");
          break;
        case "user":
        default:
          console.log("Redirecting to user dashboard");
          navigate("/user");
          break;
      }
    }
  }, [otpVerified, user, navigate]);

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
            <Typography variant="h4" component="h1" gutterBottom>
              Verify OTP
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Enter the verification code sent to your email
            </Typography>
          </Box>

          {emailForOtp && (
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Chip
                icon={<>Success</>}
                label={`OTP sent to: ${emailForOtp}`}
                color="success"
                variant="outlined"
              />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {!emailForOtp && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              No email found. Please login again.
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                disabled={!emailForOtp}
                placeholder="Enter OTP"
                variant="outlined"
                inputProps={{
                  maxLength: 6,
                  style: {
                    textAlign: "center",
                    fontSize: "1.2rem",
                    letterSpacing: "0.3rem",
                    fontWeight: "bold",
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start"></InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading || !emailForOtp || !otp.trim()}
                size="large"
                startIcon={
                  loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <></>
                  )
                }
                sx={{ mt: 2, mb: 2 }}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>
            </Stack>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ textAlign: "center" }}>
            <Button variant="outlined" onClick={() => navigate("/login")}>
              Back to Login
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default OtpPage;
