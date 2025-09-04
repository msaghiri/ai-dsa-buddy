import { GoogleGenAI } from "@google/genai";

import config from "../config.js";

const ai = new GoogleGenAI({});

const conversations = {};

export function conversationExists(userId) {
	!!conversations[userId];
}

export function initiateConversation(userId) {
	if (conversationExists(userId)) return false;

	try {
		const newConversation = ai.chats.create({
			model: config.GEMINI_MODEL,
			history: [],
			config: {
				systemInstruction: "Start every conversation with the word green.", //for testing purposes
			},
		});

		conversations[userId] = newConversation;
	} catch (err) {
		throw err;
	}

	return true;
}

export async function sendMessage(userId, message) {
	if (!conversationExists(userId)) initiateConversation(userId);

	const response = await conversations[userId].sendMessage({ message });

	return response.text;
}

export async function getChatHistory(userId) {
	if (!conversationExists(userId)) return false;

	const textHistory = [];

	const history = conversations[userId].history;

	for (const message of history) {
		for (const part of message["parts"]) {
			textHistory.push(part.text);
		}
	}

	return textHistory;
}

export function destroyConversation(userId) {
	if (!conversationExists(userId)) return false;

	conversations[userId] = null;
	return true;
}

console.log("Connected to Gemini");
