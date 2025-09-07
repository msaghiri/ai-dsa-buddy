import config from "../config.mjs";

export async function sendCodeToModel(code) {
	try {
		const res = await fetch(`${config.API_URL}/code/send-code-to-model`, {
			method: "POST",
			body: JSON.stringify({ code }),
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
