import { GoogleGenAI } from "@google/genai";

import config from "../config.js";
import questions from "../questions/questions.js";

const ai = new GoogleGenAI({});

/*
	Interview Object:
	- userId (key)
	- question (lets actually pass the whole question object for now)
	- dateStarted
	- solved (maybe a true/false flag for solved... idk, what would I need that for?)
	- timeElapsed/timeRemaining (if i want timer functionality or to stop the interview due to inactivity)
*/

const interviewSessions = {};

const createInterviewSession = (question, chat, timeStarted, solved) => ({
	question,
	chat,
	timeStarted,
	solved,
});

const createQuestionPrompt = (questionPrompt) => {
	return `${config.PROMPT}\n${questionPrompt}`.trim();
};

export function interviewSessionExists(userId) {
	return !!interviewSessions[userId];
}

export function initiateInterviewSession(userId, question) {
	if (interviewSessionExists(userId)) return false;

	const questionObject = questions[question];
	if (!questionObject) return false;

	const newChatObject = ai.chats.create({
		model: config.GEMINI_MODEL,
		history: [],
		config: {
			systemInstruction: createQuestionPrompt(question.prompt),
		},
	});

	const newInterviewSession = createInterviewSession(
		questionObject,
		newChatObject,
		Date.now(),
		false
	);

	interviewSessions[userId] = newInterviewSession;

	return true;
}

export async function sendMessage(userId, message) {
	if (!interviewSessionExists(userId))
		return "Interview session does not exist";

	const response = await interviewSessions[userId].chat.sendMessage({
		message,
	});

	return response.text;
}

export function destroyInterviewSession(userId) {
	if (!interviewSessionExists(userId)) return false;

	delete interviewSessions[userId];

	return true;
}

console.log("Connected to Gemini");
