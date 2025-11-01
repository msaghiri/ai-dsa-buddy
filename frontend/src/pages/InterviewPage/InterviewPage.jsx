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
import useLocalStorage from "../../hooks/useLocalStorage.js";

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
	const [activeTab, setActiveTab] = useState(0);

	useEffect(() => {
		const check = async () => {
			const res = await interviewSessionExists();
			if (!res) navigate("/");
		};

		check();
	}, [navigate]);

	const [code, setCode] = useLocalStorage("interviewCode", "");
	const [results, setResults] = useLocalStorage("testResults", []);

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
			setResults(res);
		}
	};

	const conversationRef = useRef(null);

	return (
		<div className={style.interviewPageContainer}>
			<div className={style.tabButtons}>
				<button
					className={`${style.tabButton} ${
						activeTab === 0 ? style.activeTab : ""
					}`}
					onClick={() => setActiveTab(0)}
				>
					Problem
				</button>
				<button
					className={`${style.tabButton} ${
						activeTab === 1 ? style.activeTab : ""
					}`}
					onClick={() => setActiveTab(1)}
				>
					Editor
				</button>
				<button
					className={`${style.tabButton} ${
						activeTab === 2 ? style.activeTab : ""
					}`}
					onClick={() => setActiveTab(2)}
				>
					Chat
				</button>
			</div>

			<div className={style.contentWrapper}>
				{activeTab === 0 && (
					<div className={style.leftHandSide}>
						<PromptContainer
							question={JSON.parse(localStorage.getItem("question"))}
						/>
						<CodeResultsComponent results={results} />
					</div>
				)}

				{activeTab === 1 && (
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
				)}

				{activeTab === 2 && (
					<div className={style.rightHandSide}>
						<ConversationComponent
							className={style.conversationComponent}
							ref={conversationRef}
						/>
						<div className={style.actionButtonContainer}>
							<button
								className={style.actionButton}
								onClick={() =>
									conversationRef.current?.handleSendCodeToModel(code)
								}
							>
								Review Code
							</button>
							<button className={style.actionButton} onClick={handleTestCode}>
								Run tests
							</button>
						</div>
					</div>
				)}
			</div>

			<div className={style.desktopLayout}>
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
							onClick={() =>
								conversationRef.current?.handleSendCodeToModel(code)
							}
						>
							Review Code
						</button>
						<button className={style.actionButton} onClick={handleTestCode}>
							Run tests
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default InterviewPage;
