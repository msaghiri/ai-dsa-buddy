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

// --- Re-usable Components ---

function PromptContainer({ question }) {
	return (
		<div className={style.promptContainer}>
			<h1 className={style.questionTitle}>{question.displayName}</h1>
			<p className={style.questionPrompt}>{question.prompt}</p>
		</div>
	);
}

function TabNavigation({ activeTab, setActiveTab }) {
	return (
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
	);
}

function ProblemView({ question, results }) {
	return (
		<div className={style.leftHandSide}>
			<PromptContainer question={question} />
			<CodeResultsComponent results={results} />
		</div>
	);
}

function EditorView({ code, setCode, highlightCode }) {
	return (
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
	);
}

function ChatView({ conversationRef, onReviewCode, onRunTests }) {
	return (
		<div className={style.rightHandSide}>
			<ConversationComponent
				className={style.conversationComponent}
				ref={conversationRef}
			/>
			<div className={style.actionButtonContainer}>
				<button className={style.actionButton} onClick={onReviewCode}>
					Review Code
				</button>
				<button className={style.actionButton} onClick={onRunTests}>
					Run tests
				</button>
			</div>
		</div>
	);
}

// --- Main Page Component ---

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

	const handleReviewCode = () => {
		conversationRef.current?.handleSendCodeToModel(code);
	};

	// Parse question once
	const question = JSON.parse(localStorage.getItem("question"));

	return (
		<div className={style.interviewPageContainer}>
			{/* Mobile/Tab Layout Components */}
			<TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

			<div className={style.contentWrapper}>
				{activeTab === 0 && (
					<ProblemView question={question} results={results} />
				)}

				{activeTab === 1 && (
					<EditorView
						code={code}
						setCode={setCode}
						highlightCode={highlightCode}
					/>
				)}

				{activeTab === 2 && (
					<ChatView
						conversationRef={conversationRef}
						onReviewCode={handleReviewCode}
						onRunTests={handleTestCode}
					/>
				)}
			</div>

			{/* Desktop Layout Components */}
			<div className={style.desktopLayout}>
				<ProblemView question={question} results={results} />
				<EditorView
					code={code}
					setCode={setCode}
					highlightCode={highlightCode}
				/>
				<ChatView
					conversationRef={conversationRef}
					onReviewCode={handleReviewCode}
					onRunTests={handleTestCode}
				/>
			</div>
		</div>
	);
}

export default InterviewPage;
