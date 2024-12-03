import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import SignUpPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import React, { useEffect } from "react";
import FloatingShape from "../src/components/floatingShape";
import { useAuthStore } from "./store/authStore";
import LoadingSpinner from "./components/LoadingSpinner";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import Profile from "./pages/Profile";
import CreatePost from "./pages/createPost";
import Friends from "./pages/FriendsList";
import ExploreFriends from "./pages/FriendsExplore";
import Website from "./pages/website";

// Protected Route: Redirect if not authenticated or not verified
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

// Redirect Authenticated Users away from login/signup if they are already logged in
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user.isVerified) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth(); // Perform authentication check
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />; // Show loading spinner while checking auth

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center relative overflow-hidden">
        <FloatingShape
          color="bg-pink-300"
          size="w-64 h-64"
          top="-5%"
          left="10%"
          delay={0}
        />
        <FloatingShape
          color="bg-pink-200"
          size="w-48 h-48"
          top="70%"
          left="80%"
          delay={5}
        />
        <FloatingShape
          color="bg-pink-400"
          size="w-32 h-32"
          top="40%"
          left="10%"
          delay={2}
        />

        <Routes>
          {/* Protected Home Route */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* Signup and Login Routes */}
          <Route
            path="/signup"
            element={
                <SignUpPage />
            }
          />
          <Route
            path="/login"
            element={
              <RedirectAuthenticatedUser>
                <LoginPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/website"
            element={
                <Website />
            }
          />

          {/* Email Verification */}
          <Route path="/verify-email" element={<EmailVerificationPage />} />

          {/* Password Reset Routes */}
          <Route
            path="/forgot-password"
            element={
              <RedirectAuthenticatedUser>
                <ForgotPasswordPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/reset-password/:token"
            element={
              <RedirectAuthenticatedUser>
                <ResetPasswordPage />
              </RedirectAuthenticatedUser>
            }
          />

          {/* Profile Page */}
          <Route
            path="/profile/:id"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Create Post Page */}
          <Route
            path="/create-post"
            element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            }
          />

          {/* Friends Page */}
          <Route
            path="/friends"
            element={
              <ProtectedRoute>
                <Friends />
              </ProtectedRoute>
            }
          />

          {/* Explore Friends Page */}
          <Route
            path="/explore-friends"
            element={
              <ProtectedRoute>
                <ExploreFriends />
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
        </Routes>
      </div>
    </>
  );
}

export default App;
