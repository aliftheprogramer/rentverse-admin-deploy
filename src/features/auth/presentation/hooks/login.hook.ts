import { useCallback, useState } from "react";

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
				// TODO: Replace with real API call
				await new Promise((res) => setTimeout(res, 800));

				if (!email || !password) {
					throw new Error("Email and password are required");
				}

				// Simulate successful login: store token in localStorage
				localStorage.setItem("token", "dummy-token");

				// Navigate to app root/home — let router guard handle protected views
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
