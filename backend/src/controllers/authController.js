import {
	verifyUser,
	isUserLoggedIn,
	createAuthenticationCookie,
} from "../utils/authUtils.js";
import { addUser } from "../db/userRepository.js";
import { User } from "../models/User.js";

export async function login(req, res) {
	try {
		const token = req.cookies.token;
		if (isUserLoggedIn(token)) {
			throw new Error("User already logged in");
		}

		const user = await verifyUser(req.body.code);
		createAuthenticationCookie(req, res, user);

		const userExists = await User.exists(user.userId);
		if (!userExists) await addUser(user.userId, user.email, user.email);

		return res.status(200).json({ success: true });
	} catch (err) {
		console.error("Login error:", err);
		return res
			.status(400)
			.json({ msg: "Failed to authenticate user", error: err.message });
	}
}

export function logout(req, res) {
	if (!req.cookies.token) return res.status(400).send({ msg: "Not logged in" });

	res.clearCookie("token");

	return res
		.status(200)
		.send({ success: true, msg: "Successfully logged out" });
}
