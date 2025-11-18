import { GoogleGenAI } from "@google/genai";
import { Type } from "@google/genai";

import config from "../config.js";
import questions from "../questions/questions.js";

import { v4 as uuidv4 } from "uuid";

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

const feedbacks = {};

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

const createFeedbackObject = (userId, feedback, timeCreated, expiresIn) => ({
	userId,
	feedback,
	timeCreated,
	expiresIn,
});

const feedbackSchema = {
	type: Type.OBJECT,
	properties: {
		summary: {
			type: Type.STRING,
			description:
				"A concise, two or three sentence long paragraph summarizing the candidates performance. Make sure to concisely outline the candidates strengths and weaknesses in programming ability, reasoning, and ability to explain and communicate their thoughts.",
		},
		reasoningRating: {
			type: Type.NUMBER,
			description:
				"A numerical score from 1 (Poor) to 10 (Excellent) of the candidates reasoning, pattern recognition, and/or logic demonstrated in their approach to the problem.",
			minimum: 1,
			maximum: 10,
		},
		communicationRating: {
			type: Type.NUMBER,
			description:
				"A numerical score from 1 (Poor) to 10 (Excellent) of the candidates communication abilities based on the interview transcript.",
			minimum: 1,
			maximum: 10,
		},
	},
};

const createFeedbackPrompt = (informationObject) => `
You are an expert Senior Software Engineer and a highly-skilled technical interviewer.
Your task is to provide a critical evaluation of a candidate's mock interview performance based on the provided data.

Analyze the 'question' and 'history' from the JSON data below to assess the candidate's reasoning and communication skills.

You must provide your evaluation by filling out all fields of the requested JSON schema.

---
INTERVIEW DATA:
${JSON.stringify(informationObject)}
---
`;

const createQuestionPrompt = (questionPrompt) => `
${config.PROMPT}
${questionPrompt}

Example 1:
Input: Hey!
Output: ${questionPrompt}, how do you plan on approaching this problem?
`;

export function interviewSessionExists(userId) {
	return !!interviewSessions[userId];
}

export function getInterviewSession(userId) {
	return interviewSessions[userId];
}

export function getInterviewFeedbackById(feedbackId) {
	return feedbacks[feedbackId];
}

export function initiateInterviewSession(userId, question) {
	if (interviewSessionExists(userId)) return false;

	const questionObject = questions[question];
	if (!questionObject) return false;

	console.log(createQuestionPrompt(questionObject.prompt));

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

	interview.lastAttempt = attempt;

	console.log(interview.lastAttempt);
}

export function getLastAttempt(userId) {
	if (!interviewSessionExists(userId))
		throw new Error("Interview session does not exist");

	const session = interviewSessions[userId];

	if (!session.attempted) throw new Error("No attempts were submitted.");

	return session.lastAttempt;
}

export async function sendMessage(userId, message) {
	if (!interviewSessionExists(userId))
		return "Interview session does not exist";

	const response = await interviewSessions[userId].chat.sendMessage({
		message,
	});

	return response.text;
}

export async function getInterviewFeedback(userId) {
	const session = interviewSessions[userId];
	const questionPrompt = session.question.prompt;
	const chatHistory = session.chat.history;

	const informationObject = {
		question: questionPrompt,
		history: chatHistory,
	};

	const prompt = createFeedbackPrompt(informationObject);

	const response = await ai.models.generateContent({
		model: config.GEMINI_MODEL,
		contents: prompt,
		config: {
			responseMimeType: "application/json",
			responseSchema: feedbackSchema,
		},
	});

	return JSON.parse(response.text);
}

export function destroyInterviewSession(userId) {
	if (!interviewSessionExists(userId)) return false;

	const interviewFeedback = getInterviewFeedback(userId);

	delete interviewSessions[userId];

	const feedbackId = uuidv4();
	feedbacks[feedbackId] = createFeedbackObject(
		userId,
		interviewFeedback,
		Date.now(),
		36000
	);

	console.log(feedbacks);

	return { success: true, feedbackId };
}

console.log("Connected to Gemini");
