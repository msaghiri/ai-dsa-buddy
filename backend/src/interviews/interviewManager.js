import { GoogleGenAI } from "@google/genai";

import config from "../config.js";

const ai = new GoogleGenAI({});

const interviewSessions = {};

export function interviewSessionExists(userId) {
	return !!interviewSessions[userId];
}

export function initiateInterviewSession(userId) {
	if (interviewSessionExists(userId)) return false;

	const newInterviewSession = ai.chats.create({
		model: config.GEMINI_MODEL,
		history: [],
		config: {
			systemInstruction: config.PROMPT,
		},
	});

	interviewSessions[userId] = newInterviewSession;

	return true;
}

export async function sendMessage(userId, message) {
	if (!interviewSessionExists(userId)) initiateInterviewSession(userId);

	const response = await interviewSessions[userId].sendMessage({ message });

	return response.text;
}

export function destroyInterviewSession(userId) {
	if (!interviewSessionExists(userId)) return false;

	delete interviewSessions[userId];

	return true;
}

console.log("Connected to Gemini");
