import MessageComponent from "../../components/MessageComponent/MessageComponent.jsx";
import { useState, useEffect } from "react";

import {
	storeMessage,
	sendMessage,
	initiateConversation,
} from "../../services/geminiService.js";

import style from "./ConversationPage.module.css";

function InputField({ value, onChange, onEnter }) {
	return (
		<input
			className={style.inputField}
			type="text"
			value={value}
			onChange={(e) => onChange(e.target.value)}
			onKeyDown={(e) => {
				if (e.key === "Enter" && value.trim()) onEnter();
			}}
		/>
	);
}

function ConversationPage() {
	const [currentMessageInput, setCurrentMessageInput] = useState("");

	const [messageHistory, setMessageHistory] = useState(() => {
		const stored = localStorage.getItem("conversation");
		return stored ? JSON.parse(stored) : [];
	});

	useEffect(() => {
		initiateConversation().catch(console.error);
	}, []);

	const handleSendMessage = async () => {
		try {
			const response = await sendMessage(currentMessageInput);

			const userMessage = { role: "user", msg: currentMessageInput };
			const responseMessage = { role: "model", msg: response };

			storeMessage(userMessage);
			storeMessage(responseMessage);
			setMessageHistory((prev) => [...prev, userMessage, responseMessage]);

			setCurrentMessageInput("");
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div className={style.conversationPageContainer}>
			<div className={style.conversationArea}>
				<div className={style.textArea}>
					{messageHistory.map((message, idx) => (
						<MessageComponent
							key={idx}
							role={message.role}
							message={message.msg}
						/>
					))}
				</div>
				<div className={style.sendMessageArea}>
					<InputField
						value={currentMessageInput}
						onChange={setCurrentMessageInput}
						onEnter={handleSendMessage}
					/>
					<input
						className={style.sendButton}
						type="button"
						value="↑"
						onClick={handleSendMessage}
						disabled={!currentMessageInput.trim()}
					/>
				</div>
			</div>
		</div>
	);
}

export default ConversationPage;
