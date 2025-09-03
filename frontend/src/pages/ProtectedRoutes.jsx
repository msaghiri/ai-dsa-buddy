import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { verifyAuth } from "../services/authService.js";

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
		return <h2>Loading...</h2>;
	}

	return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoutes;
