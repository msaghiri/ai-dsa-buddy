import { Link } from "react-router-dom";
import style from "./NavigationBar.module.css";

function NavigationBar() {
	return (
		<nav className={style.navigationBar}>
			<p className={style.logo}>LOGO</p>
			<ul className={style.navigationList}>
				<li className={style.navigationItem}>
					<Link className={style.navigationItemText} to="/login">
						Profile
					</Link>
				</li>
				<li className={style.navigationItem}>
					<Link className={style.navigationItemText} to="/interview">
						Chat
					</Link>
				</li>
				<li className={style.navigationItem}>
					<Link className={style.navigationItemText} to="/">
						Placeholder
					</Link>
				</li>
			</ul>
		</nav>
	);
}

export default NavigationBar;
