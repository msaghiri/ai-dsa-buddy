import { useState, useCallback } from "react";

import ConversationComponent from "../../components/ConversationComponent/ConversationComponent.jsx";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-python";
import "prismjs/themes/prism-okaidia.css";
import style from "./InterviewPage.module.css";

function InterviewPage() {
	const [code, setCode] = useState("");

	const highlightCode = useCallback(
		(code) => Prism.highlight(code, Prism.languages.python, "python"),
		[]
	);

	return (
		<div className={style.interviewPageContainer}>
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
				<ConversationComponent className={style.conversationComponent} />
				<div className={style.actionButtonContainer}>
					<button className={style.actionButton}>Review Code</button>
					<button className={style.actionButton}>Run tests</button>
				</div>
			</div>
		</div>
	);
}

export default InterviewPage;
