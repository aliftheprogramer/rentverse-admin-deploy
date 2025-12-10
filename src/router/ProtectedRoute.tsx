import React from "react";
import { Navigate } from "react-router-dom";

type ProtectedRouteProps = {
	children: React.ReactNode;
	requiredRole?: string;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
	const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
	const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;
	if (!token) {
		return <Navigate to="/login" replace />;
	}
	if (requiredRole && role !== requiredRole) {
		return <Navigate to="/unauthorized" replace />;
	}
	return <>{children}</>;
};

export default ProtectedRoute;
