import { GoogleGenAI } from "@google/genai";

import config from "../config.js";

const ai = new GoogleGenAI({});

const conversations = {};

export function conversationExists(userId) {
	return !!conversations[userId];
}

export function initiateConversation(userId) {
	if (conversationExists(userId)) return false;

	const newConversation = ai.chats.create({
		model: config.GEMINI_MODEL,
		history: [],
		config: {
			systemInstruction: config.PROMPT,
		},
	});

	conversations[userId] = newConversation;

	return true;
}

export async function sendMessage(userId, message) {
	if (!conversationExists(userId)) initiateConversation(userId);

	const response = await conversations[userId].sendMessage({ message });

	return response.text;
}

export async function getChatHistory(userId) {
	if (!conversationExists(userId)) return [];
	return conversations[userId].history.flatMap((msg) =>
		msg.parts.map((p) => p.text)
	);
}

export function destroyConversation(userId) {
	if (!conversationExists(userId)) return false;

	delete conversations[userId];

	return true;
}

console.log("Connected to Gemini");
