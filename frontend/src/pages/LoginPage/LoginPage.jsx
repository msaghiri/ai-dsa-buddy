import GoogleLoginButton from "../../components/GoogleLoginButton/GoogleLoginButton";
import LogoutButton from "../../components/LogoutButton/LogoutButton";
import { GoogleOAuthProvider } from "@react-oauth/google";
import config from "../../config.mjs";
import { useState, useEffect } from "react";
import { verifyAuth } from "../../services/authService";

import style from "./LoginPage.module.css";

function Profile({ user }) {
	return (
		<div className={style.profileComponent}>
			<div className={style.topSection}>
				<h3 className={style.displayName}>{user.name}</h3>
			</div>

			<div className={style.bottomSection}>
				<LogoutButton />
				<LogoutButton />
			</div>
		</div>
	);
}

function LoginPage() {
	const [isLoggedIn, setIsLoggedIn] = useState();
	const [user, setUser] = useState({
		name: "John Doe",
	});

	useEffect(() => {
		const checkAuth = async () => {
			const isAuth = await verifyAuth();
			setIsLoggedIn(isAuth);

			if (isAuth) {
				setUser({
					name: "Logged in, no?",
				});
			}
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
				<Profile user={user} />
			)}
		</div>
	);
}

export default LoginPage;
