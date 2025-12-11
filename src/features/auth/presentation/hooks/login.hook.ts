import { useCallback, useState } from "react";
import { apiClient } from "../../../../core/api.client";
import { endpoints } from "../../../../core/api.urls";

export function useLogin() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const toggleShowPassword = useCallback(() => {
		setShowPassword((s) => !s);
	}, []);

	const handleSubmit = useCallback(
		async (e?: React.FormEvent) => {
			e?.preventDefault();
			setError(null);
			setLoading(true);
			try {
				if (!email || !password) {
					throw new Error("Email and password are required");
				}

				const res = await apiClient.post(endpoints.login, { email, password });
				const { accessToken, user } = res.data.data;
				localStorage.setItem("token", accessToken);
				if (user?.role) {
					localStorage.setItem("role", String(user.role));
				}
				if (user?.name) {
					localStorage.setItem("userName", String(user.name));
				}
				// Redirect to home; ProtectedRoute will verify role
				window.location.href = "/";
			} catch (err) {
				const message =
					err instanceof Error ? err.message : "Login failed";
				setError(message);
			} finally {
				setLoading(false);
			}
		},
		[email, password]
	);

	return {
		email,
		password,
		showPassword,
		loading,
		error,
		setEmail,
		setPassword,
		toggleShowPassword,
		handleSubmit,
	};
}
