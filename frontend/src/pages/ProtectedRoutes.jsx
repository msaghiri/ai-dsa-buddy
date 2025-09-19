import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { verifyAuth } from "../services/authService.js";

import { squircle } from "ldrs";
squircle.register();

function ProtectedRoutes() {
	const [isLoading, setIsLoading] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	const location = useLocation();

	useEffect(() => {
		const checkAuth = async () => {
			setIsLoading(true);
			try {
				const auth = await verifyAuth();
				setIsAuthenticated(auth);
			} catch (err) {
				setIsAuthenticated(false);
			} finally {
				setIsLoading(false);
			}
		};

		checkAuth();
	}, [location.pathname]);

	if (isLoading) {
		return (
			<l-squircle
				size="45"
				stroke="5"
				stroke-length="0.25"
				bg-opacity="0.1"
				speed="0.9"
				color="#dfdfdfff"
				style={{
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
				}}
			></l-squircle>
		);
	}

	return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoutes;
