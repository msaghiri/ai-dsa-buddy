import config from "../config.mjs";

export async function authenticate(authCode) {
	try {
		const res = await fetch(`${config.API_URL}/auth/login`, {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ code: authCode }),
		});

		const data = await res.json();

		if (!res.ok || data.success !== true) {
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
			headers: {
				"Content-Type": "application/json",
			},
		});

		const data = await res.json();

		if (data.success !== true || !res.ok) {
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
			headers: {
				"Content-Type": "application/json",
			},
		});

		const data = await authStatus.json();

		return data;
	} catch (err) {
		return false;
	}
}
