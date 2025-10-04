import { getUserInformation } from "../../services/authService";
import styles from "./DashboardPage.module.css";
import { useEffect, useState } from "react";

function DashboardPage() {
	const [displayName, setDisplayName] = useState("");

	useEffect(() => {
		const getName = async () => {
			const name = await getUserInformation();
			setDisplayName(name.displayName);
		};

		getName();
	}, []);

	return (
		<div className={styles.mainPageContainer}>
			<div className={styles.welcomeBox}>
				<h1 className={styles.header}>Welcome, {displayName}</h1>
				<p className={styles.subHeader}>
					Ready to start a new practice session?
				</p>
				<button className={styles.startButton} onClick={console.log("")}>
					{/*doesnt do anything yet, placeholder*/}
					Start New Interview
				</button>
			</div>
		</div>
	);
}
export default DashboardPage;
