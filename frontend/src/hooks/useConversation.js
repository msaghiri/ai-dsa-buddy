import { useState, useRef, useEffect, useCallback } from "react";
import {
	storeMessage,
	sendMessage,
	initiateConversation,
} from "../services/geminiService.js";
import { sendCodeToModel } from "../services/codeService.js";

//Add message is for frontend only
const addMessage = (setMessages, message) => {
	storeMessage(message);
	setMessages((prev) => [...prev, message]);
};

const createMessage = (role, msg) => ({ role, msg });

export default function useConversation() {
	const [messages, setMessages] = useState(() => {
		const stored = localStorage.getItem("conversation");
		return stored ? JSON.parse(stored) : [];
	});

	const [isLoading, setIsLoading] = useState(false);

	const [input, setInput] = useState("");
	const endRef = useRef(null);

	useEffect(() => {
		initiateConversation().catch(console.error);
	}, []);

	useEffect(() => {
		endRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const sendMessageHandler = useCallback(async () => {
		const trimmed = input.trim();
		if (!trimmed) return;

		const userMessage = createMessage("user", trimmed);
		addMessage(setMessages, userMessage);
		setInput("");

		try {
			setIsLoading(true);

			const response = await sendMessage(trimmed);
			const modelMessage = createMessage("model", response || "No response.");

			setIsLoading(false);

			addMessage(setMessages, modelMessage);
		} catch (err) {
			setIsLoading(false);

			console.error(err);

			const errorMessage = createMessage(
				"model",
				"Error occurred. Could not contact AI."
			);
			addMessage(setMessages, errorMessage);
		}
	}, [input]);

	const sendCodeHandler = useCallback(async (code) => {
		if (!code.trim()) return;

		try {
			const response = await sendCodeToModel(code);
			if (response) {
				const modelMessage = createMessage("model", response);
				addMessage(setMessages, modelMessage);
			}
		} catch (err) {
			console.error(err);
		}
	}, []);

	return {
		messages,
		input,
		setInput,
		sendMessageHandler,
		sendCodeHandler,
		endRef,
		isLoading,
		setIsLoading,
	};
}
