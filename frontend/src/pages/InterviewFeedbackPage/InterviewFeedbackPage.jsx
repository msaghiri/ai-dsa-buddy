import style from "./InterviewFeedbackPage.module.css";

import { useEffect } from "react";
import { useState } from "react";
import { getInterviewFeedback } from "../../services/interviewService";
import { useParams } from "react-router-dom";

/* 
	Reasoning rating
	Communication rating
	Summary
	Overall rating
*/

function SummarySection({ summary }) {
	return (
		<div className={`${style.resultSection} ${style.summarySection}`}>
			<p>{summary}</p>
		</div>
	);
}
function ScoreSection({ variable, score }) {
	return (
		<div className={`${style.resultSection} ${style.scoreSection}`}>
			<p>
				{variable}: {score}/10
			</p>
		</div>
	);
}

function FeedbackContainer({ feedback }) {
	return (
		<div className={style.feedbackContainer}>
			<SummarySection summary={feedback.summary} />
			<ScoreSection variable="Reasoning" score={feedback.reasoningRating} />
			<ScoreSection
				variable="Communication"
				score={feedback.communicationRating}
			/>
			<ScoreSection variable="Overall" score={feedback.overallRating} />
		</div>
	);
}

function InterviewFeedbackPage() {
	const { feedbackId } = useParams();

	const [isLoading, setIsLoading] = useState(true);
	const [feedbackObject, setFeedbackObject] = useState({});

	useEffect(() => {
		(async () => {
			const res = await getInterviewFeedback(feedbackId);
			if (res.success) {
				setFeedbackObject(res.feedbackObject);
				setIsLoading(false);
			}
		})();
	}, [feedbackId]);

	return (
		<div className={style.pageContainer}>
			<h1>Interview Feedback</h1>
			{!isLoading && <FeedbackContainer feedback={feedbackObject.feedback} />}
		</div>
	);
}

export default InterviewFeedbackPage;
