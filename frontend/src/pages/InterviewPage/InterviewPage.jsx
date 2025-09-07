import { useState } from "react";

import ConversationComponent from "../../components/ConversationComponent/ConversationComponent.jsx";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-python";
import "prismjs/themes/prism-okaidia.css";
import style from "./InterviewPage.module.css";

function InterviewPage() {
	const [code, setCode] = useState("");

	return (
		<div className={style.interviewPageContainer}>
			<div className={style.contentBorder}>
				<div className={style.editorBackground}>
					<Editor
						value={code}
						onValueChange={(code) => setCode(code)}
						highlight={(code) =>
							Prism.highlight(code, Prism.languages.python, "python")
						}
						padding={20}
						style={{
							fontFamily: '"Fira code", "Fira Mono", monospace',
							fontSize: 14,
							width: "100%",
							height: "100%",
							background: "transparent",
							borderRadius: "40px",
						}}
						textareaClassName={style.codeEditorTextArea}
					/>
				</div>
				<ConversationComponent className={style.conversationComponent} />
			</div>
		</div>
	);
}

export default InterviewPage;
