import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Auth from "../pages/auth";
import Chat from "../pages/chat";
import Profile from "../pages/profile";
import { selectUser } from "../features/auth/authSlice";

const PrivateRoute = ({ children }) => {
  const user = useSelector(selectUser);
  const isAuthenticated = !!user;
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

const AuthRoute = ({ children }) => {
  const user = useSelector(selectUser);
  const isAuthenticated = !!user;
  return isAuthenticated ? <Navigate to="/chat" /> : children;
};

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={
            <AuthRoute>
              <Auth />
            </AuthRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
