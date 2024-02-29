import React from "react";
import { useAuth } from "../customHooks/userAuth";
import { Navigate, Outlet } from "react-router-dom";
import { Spin } from "antd";
import AppContextProvider from "../store/appStore";
import SocketContextProvider from "../store/socketStore";
function ProtectRoute() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="glob-spin">
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  return (
    <AppContextProvider user={user}>
      <SocketContextProvider>
        <Outlet />
      </SocketContextProvider>
    </AppContextProvider>
  );
}

export default ProtectRoute;
