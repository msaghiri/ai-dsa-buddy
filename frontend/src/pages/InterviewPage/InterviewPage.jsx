import { useState, useCallback, useRef, useEffect } from "react";

import ConversationComponent from "../../components/ConversationComponent/ConversationComponent.jsx";
import CodeResultsComponent from "../../components/CodeResultsComponent/CodeResultsComponent.jsx";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-python";
import "prismjs/themes/prism-okaidia.css";
import style from "./InterviewPage.module.css";
import { interviewSessionExists } from "../../services/interviewService.js";
import { testCode } from "../../services/codeService.js";
import { useNavigate } from "react-router-dom";

function PromptContainer({ question }) {
	return (
		<div className={style.promptContainer}>
			<h1 className={style.questionTitle}>{question.displayName}</h1>
			<p className={style.questionPrompt}>{question.prompt}</p>
		</div>
	);
}

function InterviewPage() {
	const navigate = useNavigate();

	useEffect(() => {
		const check = async () => {
			const res = await interviewSessionExists();
			if (!res) navigate("/");
		};

		check();
	}, [navigate]);

	const [code, setCode] = useState("");
	const [results, setResults] = useState([]);

	const fetchResultsLocally = () => {
		if (localStorage.getItem("testResults") !== null) {
			const testResults = JSON.parse(localStorage.getItem("testResults"));
			setResults(testResults);
		} else {
			setResults([]);
		}
	};

	useEffect(() => {
		fetchResultsLocally();
	}, []);

	//console.log(localStorage.getItem("question"));

	const highlightCode = useCallback(
		(code) => Prism.highlight(code, Prism.languages.python, "python"),
		[]
	);

	const handleTestCode = async () => {
		const res = await testCode(code);
		if (!res || res.error) {
			setResults([
				{
					passed: false,
					expectedResult: "",
					result: res.error,
				},
			]);
		} else {
			localStorage.setItem("testResults", JSON.stringify(res));
			setResults(res);
		}
	};

	const conversationRef = useRef(null);

	return (
		<div className={style.interviewPageContainer}>
			<div className={style.leftHandSide}>
				<PromptContainer
					question={JSON.parse(localStorage.getItem("question"))}
				/>
				<CodeResultsComponent results={results} />
			</div>
			<div className={style.editorBackground}>
				<Editor
					value={code}
					onValueChange={(code) => setCode(code)}
					highlight={highlightCode}
					style={{
						fontFamily: '"Fira code", "Fira Mono", monospace',
						fontSize: 14,
						width: "100%",
						minHeight: "100%",
						whiteSpace: "pre",
						background: "transparent",
					}}
					padding={30}
					tabSize={4}
					textareaClassName={style.codeEditorTextArea}
				/>
			</div>
			<div className={style.rightHandSide}>
				<ConversationComponent
					className={style.conversationComponent}
					ref={conversationRef}
				/>
				<div className={style.actionButtonContainer}>
					<button
						className={style.actionButton}
						onClick={() => conversationRef.current?.handleSendCodeToModel(code)}
					>
						Review Code
					</button>
					<button className={style.actionButton} onClick={handleTestCode}>
						Run tests
					</button>
				</div>
			</div>
		</div>
	);
}

export default InterviewPage;
