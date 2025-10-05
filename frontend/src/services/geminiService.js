import { verifyAuth } from "./authService.js";
import config from "../config.mjs";

const JSON_HEADERS = { "Content-Type": "application/json" };
const createMessagePayload = (message) => ({ message });

export async function initiateConversation() {
	const isAuthenticated = await verifyAuth();
	if (!isAuthenticated) return false;

	try {
		const res = await fetch(`${config.API_URL}/gemini/init-convo`, {
			method: "POST",
			credentials: "include",
			headers: JSON_HEADERS,
		});

		const data = await res.json();

		if (!data.success) throw new Error("Failed to initialize conversation.");

		return true;
	} catch (err) {
		console.log(err);
		return false;
	}
}

export async function conversationExists() {
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

export async function sendMessage(message) {
	try {
		const res = await fetch(`${config.API_URL}/gemini/send-message`, {
			method: "POST",
			body: JSON.stringify(createMessagePayload(message)),
			credentials: "include",
			headers: JSON_HEADERS,
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
			method: "POST",
			credentials: "include",
			headers: JSON_HEADERS,
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
	localStorage.removeItem("conversation");
}
