import MessageComponent from "../MessageComponent/MessageComponent.jsx";
import {
	useState,
	useEffect,
	useRef,
	useImperativeHandle,
	forwardRef,
} from "react";

import {
	storeMessage,
	sendMessage,
	initiateConversation,
} from "../../services/geminiService.js";

import { sendCodeToModel } from "../../services/codeService.js";

import style from "./ConversationComponent.module.css";

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

const ConversationComponent = forwardRef((props, ref) => {
	const endOfMessages = useRef(null);

	const [currentMessageInput, setCurrentMessageInput] = useState("");

	const [messageHistory, setMessageHistory] = useState(() => {
		const stored = localStorage.getItem("conversation");
		return stored ? JSON.parse(stored) : [];
	});

	useEffect(() => {
		initiateConversation().catch(console.error);
	}, []);

	useEffect(() => {
		scrollToBottom();
	}, [messageHistory]);

	const handleSendMessage = async () => {
		try {
			const messageToSend = currentMessageInput;
			if (!messageToSend.trim()) throw new Error("No Message");
			const userMessage = { role: "user", msg: messageToSend };
			storeMessage(userMessage);
			setMessageHistory((prev) => [...prev, userMessage]);
			setCurrentMessageInput("");

			const response = await sendMessage(messageToSend);
			if (!response) throw new Error("No response");
			if (response === false) throw new Error("No response");

			const responseMessage = { role: "model", msg: response };
			storeMessage(responseMessage);
			setMessageHistory((prev) => [...prev, responseMessage]);
		} catch (err) {
			console.error(err);
			const errorMessage = {
				role: "model",
				msg: "Error occured, could not contact AI",
			};
			storeMessage(errorMessage);
			setMessageHistory((prev) => [...prev, errorMessage]);
		}
	};

	const handleSendCodeToModel = async (code) => {
		try {
			if (!code.trim()) throw new Error("No code");
			const response = await sendCodeToModel(code);
			if (!response) throw new Error("No response");
			if (response === false) throw new Error("No response");

			const responseMessage = { role: "model", msg: response };
			storeMessage(responseMessage);
			setMessageHistory((prev) => [...prev, responseMessage]);
		} catch (err) {
			console.error(err);
		}
	};

	const scrollToBottom = () => {
		endOfMessages.current?.scrollIntoView({ behavior: "smooth" });
	};

	useImperativeHandle(ref, () => {
		return {
			handleSendCodeToModel,
		};
	});

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

					<div ref={endOfMessages} />
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
});

export default ConversationComponent;
