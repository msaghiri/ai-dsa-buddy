import { useGoogleLogin } from "@react-oauth/google";
import { authenticate } from "../../services/authService.js";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/g-logo.png";
import style from "./GoogleLoginButton.module.css";

function GoogleLoginButton() {
	const navigate = useNavigate();

	const handleGoogleLogin = useGoogleLogin({
		flow: "auth-code",
		onSuccess: async (response) => {
			const res = await authenticate(response.code);
			if (res.success) {
				navigate("/");
			}
		},
		scope: "openid email profile",
	});

	return (
		<button className={style.button} onClick={handleGoogleLogin}>
			<img src={logo} className={style.googleIcon} /> Sign in with Google
		</button>
	);
}

export default GoogleLoginButton;
