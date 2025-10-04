import { logout } from "../../services/authService";
import styles from "./LogoutButton.module.css";
import { useNavigate } from "react-router-dom";

function LogoutButton() {
	const navigate = useNavigate();

	const handleLogOut = async () => {
		await logout();
		window.location.href = "/login";
	};

	return (
		<button className={styles.button} onClick={handleLogOut}>
			Sign out
		</button>
	);
}

export default LogoutButton;
