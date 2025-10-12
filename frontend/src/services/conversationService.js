import config from "../config.mjs";

const JSON_HEADERS = { "Content-Type": "application/json" };
const createMessagePayload = (message) => ({ message });

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

export function storeMessage(message) {
	const currentConversation = localStorage.getItem("conversation")
		? JSON.parse(localStorage.getItem("conversation"))
		: [];

	currentConversation.push(message);

	localStorage.setItem("conversation", JSON.stringify(currentConversation));
}

export function clearStorage() {
	localStorage.removeItem("conversation");
	localStorage.removeItem("question");
}
