import React from "react";
import { useLogin } from "./hooks/login.hook";
import { Link } from "react-router-dom";
import backgroundImage from "../../../assets/background.png";

const LoginPage: React.FC = () => {
	const {
		email,
		password,
		showPassword,
		loading,
		error,
		setEmail,
		setPassword,
		toggleShowPassword,
		handleSubmit,
	} = useLogin();

	return (
		<div className="min-h-screen flex">
			<div className="relative w-1/2 bg-cover bg-center flex items-center justify-center"
					 style={{
						 backgroundImage: `url(${backgroundImage})`,
					 }}>
				<div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
				<div className="relative z-10 max-w-xl text-white text-center px-8">
					<h1 className="m-0 text-4xl font-semibold">Welcome to Rentverse</h1>
					<p className="mt-4 leading-relaxed opacity-90">
						Realize your dream home. We craft spaces that are functional,
						inspiring joy, tranquility, and connection.
					</p>
				</div>
			</div>

			<div className="w-1/2 p-10 flex items-center justify-center bg-white">
				<div className="w-full max-w-[420px]">
					<h2 className="mb-6 font-semibold text-2xl text-red-800">Login Now</h2>

					<form onSubmit={handleSubmit} className="space-y-4">
						{error && (
							<div className="mb-3 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">
								{error}
							</div>
						)}

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="budi.siregar@gmail.com"
								required
								className="w-full rounded-lg border border-gray-300 bg-red-50/30 px-3 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
							<div className="flex items-center rounded-lg border border-gray-300 bg-red-50/30 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/20 transition-all">
								<input
									type={showPassword ? "text" : "password"}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="••••••••••••••••••••"
									required
									className="flex-1 rounded-lg border-0 bg-transparent px-3 py-3 outline-none"
								/>
								<button
									type="button"
									onClick={toggleShowPassword}
									className="mr-2 rounded-md border border-gray-300 bg-white px-2.5 py-2 text-sm hover:bg-gray-50 transition-colors"
								>
									{showPassword ? "Hide" : "Show"}
								</button>
							</div>
						</div>

						<button
							type="submit"
							disabled={loading}
							className="w-full rounded-lg bg-red-600 hover:bg-red-700 px-3 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
						>
							{loading ? "Loading..." : "Next"}
						</button>
					</form>

					<div className="mt-4 text-sm text-gray-500 text-center">
						Already have a Rentverse account?{" "}
						<Link to="/login" className="text-red-600 hover:text-red-700 font-semibold">
							Sign in
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
