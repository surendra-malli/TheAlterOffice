import React, { useState } from "react";
import { Box, Button, Typography, Snackbar, Alert } from "@mui/material";
import { styled } from "@mui/system";
import GoogleIcon from "@mui/icons-material/Google";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebase";
import { useAuth } from "../../context/AuthContext";

const Background = styled(Box)(({ theme }) => ({
  backgroundColor: "#fdf8ff",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  overflow: "hidden",
}));

const Circle = styled(Box)(({ theme }) => ({
  position: "absolute",
  border: "2px solid #d9a5e1",
  borderRadius: "50%",
  width: "150px",
  height: "150px",
}));

const CircleTopLeft = styled(Circle)(({ theme }) => ({
  top: "-50px",
  left: "-50px",
}));

const CircleBottomRight = styled(Circle)(({ theme }) => ({
  bottom: "-50px",
  right: "-50px",
}));

const Card = styled(Box)(({ theme }) => ({
  background: "#fff",
  padding: theme.spacing(4),
  borderRadius: "16px",
  textAlign: "center",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  zIndex: 1,
  maxWidth: "400px",
  width: "90%",
}));

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Sign in successful:', result);
      
      // Check if this is a new user
      const isNewUser = result.user.metadata.creationTime === result.user.metadata.lastSignInTime;
      
      const userToStore = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        emailVerified: result.user.emailVerified,
        isNewUser: isNewUser
      };

      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(userToStore));
      setUser(result.user);

      // Show welcome message based on whether user is new or returning
      setError(null);
      const message = isNewUser ? 
        'Welcome! Your account has been created successfully.' : 
        'Welcome back!';
      
      // You can handle additional setup for new users here if needed
      if (isNewUser) {
        // For example, you could create a user profile in your database
        // await createUserProfile(result.user);
        console.log('New user registered:', result.user.email);
      }

      navigate('/');
    } catch (error: any) {
      console.error("Error signing in with Google:", error);
      setError(error.message || 'An error occurred during sign in');
    }
  };

  return (
    <Background>
      {/* Circular Decorations */}
      <CircleTopLeft />
      <CircleBottomRight />

      {/* Main Content */}
      <Card>
        <Typography variant="h4" color="secondary" fontWeight="bold" gutterBottom>
          TaskBuddy
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          Streamline your workflow and track progress effortlessly with our all-in-one task management app.
        </Typography>
        <Button
          variant="contained"
          startIcon={<GoogleIcon />}
          onClick={handleGoogleSignIn}
          sx={{
            backgroundColor: "#000",
            color: "#fff",
            fontWeight: "bold",
            mt: 3,
            width: "100%",
            py: 1.5,
            "&:hover": {
              backgroundColor: "#333",
            },
          }}
        >
          Continue with Google
        </Button>
      </Card>

      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Background>
  );
};

export default Login;
