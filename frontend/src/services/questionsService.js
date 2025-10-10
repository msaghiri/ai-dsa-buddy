import config from "../config.mjs";
import { verifyAuth } from "./authService";
const JSON_HEADERS = { "Content-Type": "application/json" };

export async function getAllQuestions() {
	try {
		const isAuthenticated = await verifyAuth();
		if (!isAuthenticated) throw new Error("Not authenticated.");

		const res = await fetch(`${config.API_URL}/questions/`, {
			method: "GET",
			credentials: "include",
			headers: JSON_HEADERS,
		});

		const data = await res.json();
		if (!data.success) throw new Error(data.error);

		return data.data;
	} catch (err) {
		console.error(err);
		throw err;
	}
}

export async function getQuestionByName(name) {
	try {
		const isAuthenticated = await verifyAuth();
		if (!isAuthenticated) throw new Error("Not authenticated.");

		const res = await fetch(`${config.API_URL}/questions/${name}`, {
			method: "GET",
			credentials: "include",
			headers: JSON_HEADERS,
		});

		const data = await res.json();
		if (!data.success) throw new Error(data.error);

		return data.data;
	} catch (err) {
		console.error(err);
		throw err;
	}
}
