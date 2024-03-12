import React from "react";
import { useAuth } from "../customHooks/userAuth";
import { Navigate, Outlet } from "react-router-dom";
import { Spin } from "antd";
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
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

export default ProtectRoute;
