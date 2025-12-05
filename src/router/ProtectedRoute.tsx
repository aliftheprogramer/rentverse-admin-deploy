import React from "react";
import { Navigate } from "react-router-dom";

type ProtectedRouteProps = {
	children: React.ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
	const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
	if (!token) {
		return <Navigate to="/login" replace />;
	}
	return <>{children}</>;
};

export default ProtectedRoute;
