import { Route, Routes, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useAuthStore } from "./store/authStore";
import FloatingShape from "../src/components/floatingShape";
import LoadingSpinner from "./components/LoadingSpinner";
import Home from "./pages/Home";
import SignUpPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import Profile from "./pages/Profile";
import CreatePost from "./pages/createPost";
import Friends from "./pages/FriendsList";
import ExploreFriends from "./pages/FriendsExplore";
import SavedPosts from "./components/SavedPosts";
import EditPost from "./pages/editPost";
import Layout from "./pages/Layout";
import ChangePasswordPage from "./components/ChangePasswordModal";
import Requests from "./pages/Requests";
import { ThemeProvider, useTheme } from "./contexts/themeContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user || !user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;  
};

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user && user.isVerified) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppContent = () => {
  const { theme } = useTheme();

  const backgroundClasses =
    theme === "dark"
      ? "bg-gradient-to-br from-gray-900 via-purple-900 to-black"
      : "bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200";

  const shapeColors =
    theme === "dark"
      ? ["bg-pink-300", "bg-pink-200", "bg-pink-400"]
      : ["bg-purple-200", "bg-blue-200", "bg-green-200"];

  const { isCheckingAuth, checkAuth, user } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <div
      className={`min-h-screen ${backgroundClasses} flex items-center justify-center relative overflow-hidden`}
    >
      <FloatingShape color={shapeColors[0]} size="w-64 h-64" top="-5%" left="10%" delay={0} />
      <FloatingShape color={shapeColors[1]} size="w-48 h-48" top="70%" left="80%" delay={5} />
      <FloatingShape color={shapeColors[2]} size="w-32 h-32" top="40%" left="10%" delay={2} />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
                <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/signup" element={<SignUpPage />} />
        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <LoginPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/change-password"
          element={
            <RedirectAuthenticatedUser>
              <ChangePasswordPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
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
        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-post"
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />
        <Route
          path="/friend-requests"
          element={
            <ProtectedRoute>
              <Requests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-post/:id"
          element={
            <ProtectedRoute>
              <EditPost />
            </ProtectedRoute>
          }
        />
        <Route
          path="/friends"
          element={
            <ProtectedRoute>
              <Friends />
            </ProtectedRoute>
          }
        />
        <Route
          path="/explore-friends"
          element={
            <ProtectedRoute>
              <ExploreFriends />
            </ProtectedRoute>
          }
        />
        <Route
          path="/saved-posts"
          element={
            <ProtectedRoute>
              <SavedPosts user={user} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
