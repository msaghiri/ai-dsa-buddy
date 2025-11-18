import { verifyAuth } from "./authService.js";
import config from "../config.mjs";

const JSON_HEADERS = { "Content-Type": "application/json" };

export async function initiateInterview(name) {
	const isAuthenticated = await verifyAuth();
	if (!isAuthenticated) return false;

	try {
		const res = await fetch(`${config.API_URL}/gemini/init-convo`, {
			method: "POST",
			credentials: "include",
			headers: JSON_HEADERS,
			body: JSON.stringify({ question: name }),
		});

		const data = await res.json();

		if (!data.success) throw new Error("Failed to initialize conversation.");

		return true;
	} catch (err) {
		console.log(err);
		return false;
	}
}

export async function interviewSessionExists() {
	try {
		const res = await fetch(`${config.API_URL}/gemini/convo-exists`, {
			method: "GET",
			credentials: "include",
			headers: JSON_HEADERS,
		});

		const data = await res.json();
		if (!data.success) throw new Error("Failed to fetch information");

		return data.data;
	} catch (err) {
		console.log(err);
		return false;
	}
}

export async function endInterview() {
	try {
		const res = await fetch(`${config.API_URL}/gemini/end-convo`, {
			method: "POST",
			credentials: "include",
			headers: JSON_HEADERS,
		});

		const data = await res.json();
		if (!data.success) throw new Error("Failed to terminate conversation.");

		return {
			success: true,
			feedbackId: data.feedbackId,
		};
	} catch (err) {
		console.log(err);
		return false;
	}
}

export async function getInterviewFeedback(feedbackId) {
	try {
		const res = await fetch(
			`${config.API_URL}/gemini/feedback/?feedbackId=${feedbackId}`,
			{
				method: "GET",
				credentials: "include",
				headers: JSON_HEADERS,
			}
		);

		const data = await res.json();
		if (!data.success) throw new Error("Failed to fetch feedback");

		return {
			success: true,
			feedbackObject: data.feedbackObject,
		};
	} catch (err) {
		console.log(err);
		return false;
	}
}
