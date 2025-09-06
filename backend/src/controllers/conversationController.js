import {
	initiateConversation,
	sendMessage,
	getChatHistory,
	destroyConversation,
} from "../conversations/conversationManager.js";

import { verifyAuth, decodeToken } from "../utils/authUtils.js";

export async function initConvo(req, res) {
	const token = req.cookies.token;
	if (!verifyAuth(token)) return res.sendStatus(401);

	try {
		const userInformation = decodeToken(token);
		if (!userInformation) throw new Error("Failed to verify user");

		if (initiateConversation(userInformation.userId) === false) {
			throw new Error("User already engaged in a conversation.");
		}

		return res
			.status(200)
			.json({ success: true, msg: "Successfully initiated conversation" });
	} catch (err) {
		return res
			.status(400)
			.json({
				success: false,
				msg: `Failed to initiate conversation, ${err.message}`,
			});
	}
}

export async function send(req, res) {
	const token = req.cookies.token;
	if (!verifyAuth(token)) return res.sendStatus(401);

	try {
		const userInformation = decodeToken(token);
		if (!userInformation) throw new Error("Failed to verify user");

		const message = req.body.message;
		if (!message) throw new Error("No message");

		const response = await sendMessage(userInformation.userId, message);

		return res.status(200).json({
			success: true,
			response,
		});
	} catch (err) {
		return res
			.status(400)
			.json({ success: false, msg: `Failed to send message, ${err.message}` });
	}
}

export async function endConvo(req, res) {
	const token = req.cookies.token;
	if (!verifyAuth(token)) return res.sendStatus(401);

	try {
		const userInformation = decodeToken(token);
		if (!userInformation) throw new Error("Failed to verify user");

		const result = destroyConversation(userInformation.userId);
		if (!result) throw new Error("Conversation does not exist.");

		return res
			.status(200)
			.json({ success: true, msg: "Conversation successfully terminated" });
	} catch (err) {
		return res.status(400).json({
			success: false,
			msg: `Failed to terminate conversation, ${err.message}`,
		});
	}
}

export function getHistory(req, res) {} //Unimportant for now
