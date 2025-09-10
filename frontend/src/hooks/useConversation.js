// hooks/useConversation.js
import { useState, useRef, useEffect, useCallback } from "react";
import {
	storeMessage,
	sendMessage,
	initiateConversation,
} from "../services/geminiService.js";
import { sendCodeToModel } from "../services/codeService.js";

// Simple abstraction to add a message
const addMessage = (setMessages, message) => {
	storeMessage(message);
	setMessages((prev) => [...prev, message]);
};

export default function useConversation() {
	const [messages, setMessages] = useState(() => {
		const stored = localStorage.getItem("conversation");
		return stored ? JSON.parse(stored) : [];
	});

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

		// Add user message
		const userMessage = { role: "user", msg: trimmed };
		addMessage(setMessages, userMessage);
		setInput("");

		// Send to model and add response
		try {
			const response = await sendMessage(trimmed);
			const modelMessage = { role: "model", msg: response || "No response" };
			addMessage(setMessages, modelMessage);
		} catch (err) {
			console.error(err);
			const errorMessage = {
				role: "model",
				msg: "Error occurred, could not contact AI",
			};
			addMessage(setMessages, errorMessage);
		}
	}, [input]);

	const sendCodeHandler = useCallback(async (code) => {
		if (!code.trim()) return;

		try {
			const response = await sendCodeToModel(code);
			if (response) {
				const modelMessage = { role: "model", msg: response };
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
	};
}
