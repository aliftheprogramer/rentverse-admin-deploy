import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../features/auth/presentation/login.pages.tsx";
import ProtectedRoute from "./ProtectedRoute";

// Placeholder Home component — replace with real dashboard/page
const Home: React.FC = () => {
	return <div style={{ padding: 24 }}>Home (Protected)</div>;
};

const AppRouter: React.FC = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/login" element={<LoginPage />} />
				<Route
					path="/"
					element={
						<ProtectedRoute>
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
