import config from "../config.mjs";

const JSON_HEADERS = { "Content-Type": "application/json" };
const createCodePayload = (code) => ({ code });

export async function sendCodeToModel(code) {
	try {
		const res = await fetch(`${config.API_URL}/code/send-code-to-model`, {
			method: "POST",
			body: JSON.stringify(createCodePayload(code)),
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

export async function testCode(code) {
	try {
		const res = await fetch(`${config.API_URL}/code/run-tests`, {
			method: "POST",
			body: JSON.stringify(createCodePayload(code)),
			credentials: "include",
			headers: JSON_HEADERS,
		});

		const data = await res.json();
		if (!data.success) throw new Error("Failed to retrieve response from API.");

		return data.data;
	} catch (err) {
		console.log(err);
		return false;
	}
}
