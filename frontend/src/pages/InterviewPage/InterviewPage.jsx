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
	const [results, setResults] = useState([
		{
			pass: true,
			expectedResult: 4,
			result: 4,
		},
		{
			pass: true,
			expectedResult: 10,
			result: 10,
		},
		{
			pass: false,
			expectedResult: 20,
			result: 4,
		},
	]);

	const highlightCode = useCallback(
		(code) => Prism.highlight(code, Prism.languages.python, "python"),
		[]
	);

	const handleTestCode = async () => {
		const res = await testCode(code);
		console.log(res);
		//here we set the test results based on res
	};

	const conversationRef = useRef(null);

	return (
		<div className={style.interviewPageContainer}>
			<CodeResultsComponent results={results} />
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
