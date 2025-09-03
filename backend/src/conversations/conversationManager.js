import { GoogleGenAI } from "@google/genai";

import config from "../config.js";

const ai = new GoogleGenAI({});

const conversations = {};

export function initiateConversation(userId, message) {
	if (userId in conversations) {
		return false;
	}

	const newConversation = ai.chats.create({
		model: config.GEMINI_MODEL,
		history: [],
	});

	conversations[userId] = newConversation;

	return true;
}

export async function sendMessage(userId, message) {
	if (!(userId in conversations)) {
		return false;
	}

	const response = await conversations[userId].sendMessage({ message });

	return conversations[userId].history;
}

export async function getChatHistory(userId) {
	if (!(userId in conversations)) {
		return false;
	}

	const textHistory = [];

	const history = conversations[userId].history;

	for (const message of history) {
		for (const part of message["parts"]) {
			textHistory.push(part.text);
		}
	}

	return textHistory;
}

export async function destroyConversation(userId) {}

console.log("Connected to Gemini");
