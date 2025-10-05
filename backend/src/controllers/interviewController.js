import {
	initiateInterviewSession,
	sendMessage,
	destroyInterviewSession,
	interviewSessionExists,
} from "../interviews/interviewManager.js";

import { verifyAuth, decodeToken } from "../utils/authUtils.js";

export async function initInterview(req, res) {
	const token = req.cookies.token;
	if (!verifyAuth(token)) return res.sendStatus(401);

	try {
		const userInformation = decodeToken(token);
		if (!userInformation) throw new Error("Failed to verify user");

		if (!initiateInterviewSession(userInformation.sub, "two-sum")) {
			throw new Error("User already engaged in an interview.");
		}

		return res
			.status(200)
			.json({ success: true, msg: "Successfully initiated interview" });
	} catch (err) {
		return res.status(400).json({
			success: false,
			msg: `Failed to initiate interview, ${err.message}`,
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

		const response = await sendMessage(userInformation.sub, message);

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

export async function endInterview(req, res) {
	const token = req.cookies.token;
	if (!verifyAuth(token)) return res.sendStatus(401);

	try {
		const userInformation = decodeToken(token);
		if (!userInformation) throw new Error("Failed to verify user");

		const result = destroyInterviewSession(userInformation.sub);
		if (!result) throw new Error("Interview session does not exist.");

		return res.status(200).json({
			success: true,
			msg: "Interview session successfully terminated",
		});
	} catch (err) {
		return res.status(400).json({
			success: false,
			msg: `Failed to terminate interview session, ${err.message}`,
		});
	}
}

export async function interviewExists(req, res) {
	const token = req.cookies.token;
	if (!verifyAuth(token)) return res.sendStatus(401);

	try {
		const userInformation = decodeToken(token);
		if (!userInformation) throw new Error("Failed to verify user");

		const result = interviewSessionExists(userInformation.sub);

		return res.status(200).json({
			success: true,
			data: result,
			error: null,
		});
	} catch (err) {
		return res.status(400).json({
			success: false,
			msg: "",
			error: err,
		});
	}
}
