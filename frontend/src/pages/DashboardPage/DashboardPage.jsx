import { getUserInformation } from "../../services/authService.js";
import {
	getAllQuestions,
	getQuestionByName,
} from "../../services/questionsService.js"; // Assuming this is the path
import { initiateInterview } from "../../services/interviewService.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearStorage } from "../../services/conversationService.js";
import styles from "./DashboardPage.module.css";

function DashboardPage() {
	const [displayName, setDisplayName] = useState("");
	const [questions, setQuestions] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const loadDashboardData = async () => {
			try {
				const [userInfo, questionData] = await Promise.all([
					getUserInformation(),
					getAllQuestions(),
				]);

				setDisplayName(userInfo.displayName);
				setQuestions(questionData);
			} catch (err) {
				console.error("Failed to load dashboard data:", err);
				setError("Could not load data. Please try again later.");
				navigate("/login");
			} finally {
				setIsLoading(false);
			}
		};

		loadDashboardData();
	}, [navigate]);

	const handleStartInterview = (name) => {
		const start = async () => {
			const res = await initiateInterview(name);
			if (res) {
				clearStorage();
				const question = await getQuestionByName(name);
				if (!question) console.log("Failed, no question");
				localStorage.setItem("question", JSON.stringify(question));
				navigate("/interview");
			}
		};
		start();
	};

	if (isLoading) {
		return <div className={styles.centeredContainer}>Loading...</div>;
	}
	if (error) {
		return <div className={styles.centeredContainer}>{error}</div>;
	}

	return (
		<div className={styles.centeredContainer}>
			<h1 className={styles.header}>Welcome, {displayName}</h1>
			<p className={styles.subHeader}>
				Select a question to begin your practice session.
			</p>
			<div className={styles.contentBox}>
				<div className={styles.buttonGrid}>
					{questions.map((question) => (
						<button
							key={question.id}
							className={styles.secondaryButton}
							onClick={() => handleStartInterview(question.name)}
						>
							<div className={styles.questionNameContainer}>
								<p className={styles.questionName}>{question.displayName}</p>
							</div>

							<div className={styles.tagsBox}>
								{question.tags.map((tag) => (
									<p className={styles.tag}>{tag}</p>
								))}
							</div>
						</button>
					))}

					<button
						key={20}
						className={styles.secondaryButton}
						onClick={() => handleStartInterview("")}
					>
						<div className={styles.questionNameContainer}>
							<p className={styles.questionName}>Sample question</p>
						</div>

						<div className={styles.tagsBox}>
							<p className={styles.tag}>Tag 1</p>
							<p className={styles.tag}>Tag 2</p>
						</div>
					</button>
				</div>
			</div>
		</div>
	);
}

export default DashboardPage;
