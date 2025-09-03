import { logout } from "../../services/authService";
import styles from "./LogoutButton.module.css";

function LogoutButton() {
	return (
		<button className={styles.button} onClick={logout}>
			Sign out
		</button>
	);
}

export default LogoutButton;
