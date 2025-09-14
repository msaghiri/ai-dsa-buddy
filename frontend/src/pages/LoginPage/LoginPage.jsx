import GoogleLoginButton from "../../components/GoogleLoginButton/GoogleLoginButton";
import LogoutButton from "../../components/LogoutButton/LogoutButton";
import { GoogleOAuthProvider } from "@react-oauth/google";
import config from "../../config.mjs";
import { useState, useEffect } from "react";
import { verifyAuth } from "../../services/authService";

import style from "./LoginPage.module.css";

function LoginPage() {
	const [isLoggedIn, setIsLoggedIn] = useState();

	useEffect(() => {
		const checkAuth = async () => {
			const isAuth = await verifyAuth();
			setIsLoggedIn(isAuth);
		};

		checkAuth();
	}, []);

	return (
		<div className={style.loginPageContainer}>
			{!isLoggedIn ? (
				<GoogleOAuthProvider clientId={config.CLIENT_ID}>
					<h1 className={style.loginPageHeader}>Sign in</h1>
					<GoogleLoginButton />
				</GoogleOAuthProvider>
			) : (
				<LogoutButton />
			)}
		</div>
	);
}

export default LoginPage;
