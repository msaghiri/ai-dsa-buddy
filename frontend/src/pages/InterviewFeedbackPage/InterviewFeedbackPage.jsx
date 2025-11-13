import style from "./InterviewFeedbackPage.module.css";

/* 
	Reasoning rating
	Communication rating
	Summary
	Overall rating
*/

function SummarySection() {
	return (
		<div className={`${style.resultSection} ${style.summarySection}`}></div>
	);
}
function ScoreSection() {
	return <div className={`${style.resultSection} ${style.scoreSection}`}></div>;
}

function FeedbackContainer() {
	return (
		<div className={style.feedbackContainer}>
			<SummarySection />
			<ScoreSection variable="Reasoning" />
			<ScoreSection variable="Communication" />
			<ScoreSection variable="Overall" />
		</div>
	);
}

function InterviewFeedbackPage() {
	return (
		<div className={style.pageContainer}>
			<h1>Interview Feedback</h1>
			<FeedbackContainer />
		</div>
	);
}

export default InterviewFeedbackPage;
