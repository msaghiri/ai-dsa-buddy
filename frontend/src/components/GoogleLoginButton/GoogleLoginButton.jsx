import { useGoogleLogin } from "@react-oauth/google";
import { authenticate } from "../../services/authService.js";
import { useNavigate } from "react-router-dom";
import style from "./GoogleLoginButton.module.css";

function GoogleLoginButton() {
	const navigate = useNavigate();

	const handleGoogleLogin = useGoogleLogin({
		flow: "auth-code",
		onSuccess: async (response) => {
			const res = await authenticate(response.code);

			if (res.success) {
				navigate("/conversation");
			}
		},
		scope: "openid email profile",
	});

	return (
		<button className={style.button} onClick={handleGoogleLogin}>
			Log in with Google
		</button>
	);
}

export default GoogleLoginButton;
