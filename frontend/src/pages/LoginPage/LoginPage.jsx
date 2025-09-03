import GoogleLoginButton from "../../components/GoogleLoginButton/GoogleLoginButton";
import LogoutButton from "../../components/LogoutButton/LogoutButton";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import config from "../../config.mjs";

import style from "./LoginPage.module.css";

function LoginPage() {
	const navigate = useNavigate();

	return (
		<div className={style.loginPageContainer}>
			<GoogleOAuthProvider clientId={config.CLIENT_ID}>
				<h1 className={style.loginPageHeader}>Sign in</h1>
				<GoogleLoginButton />
			</GoogleOAuthProvider>
		</div>
	);
}

export default LoginPage;
