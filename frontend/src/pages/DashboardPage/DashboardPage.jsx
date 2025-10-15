import { getUserInformation } from "../../services/authService.js";
import {
	getAllQuestions,
	getQuestionByName,
} from "../../services/questionsService.js";
import { initiateInterview } from "../../services/interviewService.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearStorage } from "../../services/conversationService.js";
import styles from "./DashboardPage.module.css";

const LoadingState = () => (
	<div className={styles.centeredContainer}>Loading...</div>
);

const ErrorState = ({ message }) => (
	<div className={styles.centeredContainer}>{message}</div>
);

const DashboardHeader = ({ displayName }) => (
	<>
		<h1 className={styles.header}>Welcome, {displayName}</h1>
		<p className={styles.subHeader}>
			Select a question to begin your practice session.
		</p>
	</>
);

const QuestionCard = ({ question, onStart }) => (
	<button
		className={styles.secondaryButton}
		onClick={() => onStart(question.name)}
	>
		<div className={styles.questionNameContainer}>
			<p className={styles.questionName}>{question.displayName}</p>
		</div>
		<div className={styles.tagsBox}>
			{question.tags.map((tag, index) => (
				<p key={index} className={styles.tag}>
					{tag}
				</p>
			))}
		</div>
	</button>
);

const QuestionGrid = ({ questions, onStartInterview }) => (
	<div className={styles.contentBox}>
		<div className={styles.buttonGrid}>
			{questions.map((question) => (
				<QuestionCard
					key={question.id}
					question={question}
					onStart={onStartInterview}
				/>
			))}
		</div>
	</div>
);

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

	const handleStartInterview = async (name) => {
		const res = await initiateInterview(name);
		if (res) {
			clearStorage();
			const question = await getQuestionByName(name);
			if (!question) console.log("Failed, no question");
			localStorage.setItem("question", JSON.stringify(question));
			navigate("/interview");
		}
	};

	if (isLoading) return <LoadingState />;
	if (error) return <ErrorState message={error} />;

	return (
		<div className={styles.centeredContainer}>
			<DashboardHeader displayName={displayName} />
			<QuestionGrid
				questions={questions}
				onStartInterview={handleStartInterview}
			/>
		</div>
	);
}

export default DashboardPage;
