import { Link } from "react-router-dom";
import style from "./NavigationBar.module.css";

function NavigationBar() {
	return (
		<nav className={style.navigationBar}>
			<ul className={style.navigationList}>
				<li className={style.navigationItem}>
					<Link className={style.noUnderline} to="/login">
						Login
					</Link>
				</li>
				<li className={style.navigationItem}>
					<Link className={style.noUnderline} to="/conversation">
						Welcome
					</Link>
				</li>
			</ul>
		</nav>
	);
}

export default NavigationBar;
