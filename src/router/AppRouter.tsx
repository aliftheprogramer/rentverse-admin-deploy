import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../features/auth/presentation/login.pages.tsx";
import ProtectedRoute from "./ProtectedRoute";
import Unauthorized from "./Unauthorized";

// Placeholder Home component — replace with real dashboard/page
const Home: React.FC = () => {
	return <div style={{ padding: 24 }}>Home (Protected)</div>;
};

const AppRouter: React.FC = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/login" element={<LoginPage />} />
				<Route path="/unauthorized" element={<Unauthorized />} />
				<Route
					path="/"
					element={
						<ProtectedRoute requiredRole="ADMIN">
							<Home />
						</ProtectedRoute>
					}
				/>
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</BrowserRouter>
	);
};

export default AppRouter;
