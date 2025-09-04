import { verifyAuth } from "./authService.js";
import config from "../config.mjs";

export async function initiateConversation() {
	const isAuthenticated = await verifyAuth();
	if (!isAuthenticated) return false;

	try {
		const res = await fetch(`${config.API_URL}/gemini/init-convo`, {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		});

		const data = await res.json();

		if (data !== true) throw new Error("Failed to initialize conversation.");

		return true;
	} catch (err) {
		console.log(err);
		return false;
	}
}
export async function sendMessage(message) {
	try {
		const res = await fetch(`${config.API_URL}/gemini/send-message`, {
			method: "POST",
			body: JSON.stringify({ message }),
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		});

		const data = await res.json();
		if (!data.success)
			throw new Error("Failed to retrieve response from Gemini.");

		const textResponse = data.response;
		if (!textResponse) throw new Error("No response.");

		return textResponse;
	} catch (err) {
		console.log(err);
		return false;
	}
}
export async function endConversation() {
	try {
		const res = await fetch(`${config.API_URL}/gemini/end-convo`, {
			method: "Post",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		});

		const data = await res.json();
		if (!data.success) throw new Error("Failed to terminate conversation.");

		return true;
	} catch (err) {
		console.log(err);
		return false;
	}
}

export function storeMessage(message) {
	const currentConversation = localStorage.getItem("conversation")
		? JSON.parse(localStorage.getItem("conversation"))
		: [];

	currentConversation.push(message);

	localStorage.setItem("conversation", JSON.stringify(currentConversation));
}

export function clearStorage() {
	locaslStorage.removeItem("conversation");
}

export function init() {} //might be unnecessary we'll find out soon
