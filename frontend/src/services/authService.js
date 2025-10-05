import config from "../config.mjs";

const JSON_HEADERS = { "Content-Type": "application/json" };
const createAuthPayload = (code) => ({ code });

export async function authenticate(authCode) {
	try {
		const res = await fetch(`${config.API_URL}/auth/login`, {
			method: "POST",
			credentials: "include",
			headers: JSON_HEADERS,
			body: JSON.stringify(createAuthPayload(authCode)),
		});

		const data = await res.json();

		if (!data.success) {
			throw new Error("Authentication Error");
		}
		return data;
	} catch (err) {
		console.log(err);
		throw err;
	}
}

export async function logout() {
	try {
		const res = await fetch(`${config.API_URL}/auth/logout`, {
			method: "POST",
			credentials: "include",
			headers: JSON_HEADERS,
		});

		const data = await res.json();

		if (!data.success) {
			throw new Error("Failed to Log out");
		}

		return data;
	} catch (err) {
		console.log(err);
		throw err;
	}
}

export async function verifyAuth() {
	try {
		const authStatus = await fetch(`${config.API_URL}/auth/status`, {
			method: "GET",
			credentials: "include",
			headers: JSON_HEADERS,
		});

		const data = await authStatus.json();

		return data.success;
	} catch (err) {
		return false;
	}
}

export async function getUserInformation() {
	try {
		const res = await fetch(`${config.API_URL}/auth/get-info`, {
			method: "GET",
			credentials: "include",
			headers: JSON_HEADERS,
		});

		const formattedResponse = await res.json();

		if (!formattedResponse.data)
			throw new Error("Failed to fetch user information");

		return formattedResponse.data;
	} catch (err) {
		console.error(err);
		throw err;
	}
}
