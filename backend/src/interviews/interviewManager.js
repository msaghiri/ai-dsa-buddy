import { GoogleGenAI } from "@google/genai";

import config from "../config.js";
import questions from "../questions/questions.js";

const ai = new GoogleGenAI({});

/*
	Interview Object:
	- userId (key)
	- question (lets actually pass the whole question object for now)
	- chat
	- dateStarted
	- solved (maybe a true/false flag for solved... idk, what would I need that for?)

	- attempted
	- latestAttempt
*/

const interviewSessions = {};

const createInterviewSession = (
	question,
	chat,
	timeStarted,
	solved,
	attempted,
	lastAttempt
) => ({
	question,
	chat,
	timeStarted,
	solved,
	attempted,
	lastAttempt,
});

const createQuestionPrompt = (questionPrompt) => {
	return `${config.PROMPT}
Question: ${questionPrompt}

Example 1:
Input: Hey!
Output: ${questionPrompt}, how do you plan on approaching this problem?
`;
};

export function interviewSessionExists(userId) {
	return !!interviewSessions[userId];
}

export function getInterviewSession(userId) {
	return interviewSessions[userId];
}

export function initiateInterviewSession(userId, question) {
	if (interviewSessionExists(userId)) return false;

	const questionObject = questions[question];
	if (!questionObject) return false;

	//console.log(createQuestionPrompt(questionObject.prompt));

	const newChatObject = ai.chats.create({
		model: config.GEMINI_MODEL,
		history: [],
		config: {
			systemInstruction: createQuestionPrompt(questionObject.prompt),
		},
	});

	const newInterviewSession = createInterviewSession(
		questionObject,
		newChatObject,
		Date.now(),
		false,
		false,
		{}
	);

	interviewSessions[userId] = newInterviewSession;

	return true;
}

export function recordAttempt(userId, attempt) {
	if (!interviewSessionExists(userId))
		throw new Error("Interview session does not exist");

	const interview = interviewSessions[userId];

	if (!interview.attempted) interview.attempted = true;

	interview.attempt = attempt;

	console.log(interview.attempt);
}

export function getLastAttempt(userId) {
	if (!interviewSessionExists(userId))
		throw new Error("Interview session does not exist");

	if (!userId.attempted) throw new Error("No attempts were submitted.");

	return userId.lastAttempt;
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
