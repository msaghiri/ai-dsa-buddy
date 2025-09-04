import MessageComponent from "../../components/MessageComponent/MessageComponent.jsx";
import { useState, useEffect } from "react";

import {
	storeMessage,
	sendMessage,
	initiateConversation,
} from "../../services/geminiService.js";

import style from "./ConversationPage.module.css";

function InputField({ onChange }) {
	const [inputValue, setInputValue] = useState("");

	const handleSetInputValue = (e) => {
		setInputValue(e.target.value);
		onChange(e.target.value);
	};
	return (
		<input
			className={style.inputField}
			type="text"
			value={inputValue ?? ""}
			onChange={handleSetInputValue}
		/>
	);
}

function ConversationPage() {
	let currentMessageInput = "";

	const [messageHistory, setMessageHistory] = useState(() => {
		const stored = localStorage.getItem("conversation");

		return stored ? JSON.parse(stored) : [];
	});

	const handleInputChange = (val) => {
		currentMessageInput = val;
	};

	const handleSendMessage = async () => {
		try {
			await initiateConversation();
			const response = await sendMessage(currentMessageInput);

			//let messageHistory = localStorage.getItem("conversation");

			const userMessage = { role: "user", msg: currentMessageInput };
			const responseMessage = { role: "model", msg: response };

			storeMessage(userMessage);
			storeMessage(responseMessage);

			setMessageHistory(JSON.parse(localStorage.getItem("conversation")));
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className={style.conversationPageContainer}>
			<div className={style.conversationArea}>
				<div className={style.textArea}>
					{messageHistory.map((message) => (
						<MessageComponent role={message.role} message={message.msg} />
					))}
				</div>
				<InputField onChange={handleInputChange} />
				<input type="button" value="Send" onClick={handleSendMessage} />
			</div>
		</div>
	);
}

export default ConversationPage;
