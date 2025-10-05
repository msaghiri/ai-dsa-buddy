import { getUserInformation } from "../../services/authService";
import { initiateConversation } from "../../services/geminiService";
import styles from "./DashboardPage.module.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function DashboardPage() {
	const [displayName, setDisplayName] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		const getName = async () => {
			try {
				const name = await getUserInformation();
				setDisplayName(name.displayName);
			} catch (err) {
				navigate("/login");
			}
		};

		getName();
	}, [navigate]);

	const handleStartInterview = () => {
		const start = async () => {
			const res = await initiateConversation();
			if (res) {
				navigate("/interview");
			}
		};

		start();
	};

	return (
		<div className={styles.mainPageContainer}>
			<div className={styles.welcomeBox}>
				<h1 className={styles.header}>Welcome, {displayName}</h1>
				<p className={styles.subHeader}>
					Ready to start a new practice session?
				</p>
				<button className={styles.startButton} onClick={handleStartInterview}>
					Start New Interview
				</button>
			</div>
		</div>
	);
}
export default DashboardPage;
