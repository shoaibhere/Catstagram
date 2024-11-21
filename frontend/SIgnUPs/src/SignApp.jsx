import React, { useEffect } from "react"; // Added useEffect import
import FloatingShape from "../src/components/floatingShape";
import { Routes, Route, Navigate } from "react-router-dom"; // Added Navigate import
import DashboardPage from "./pages/DashboardPage";
import SignUpPage from "../src/pages/SignupPage";
import LoginPage from "../src/pages/LoginPage";
import Home from "../src/pages/Home";
import { useAuthStore } from "./store/authStore";
import LoadingSpinner from "./components/LoadingSpinner";

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
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user.isVerified) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function SignApp() {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth(); // Perform authentication check
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />; // Show loading spinner while checking auth

  return (
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
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <RedirectAuthenticatedUser>
              <SignUpPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  );
}

export default SignApp;
