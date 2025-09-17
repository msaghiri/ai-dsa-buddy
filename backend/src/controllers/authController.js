import {
	verifyUser,
	isUserLoggedIn,
	createAuthenticationCookie,
	verifyAuth,
	decodeToken,
} from "../utils/authUtils.js";
import { addUser } from "../db/userRepository.js";
import { User } from "../models/User.js";
import { destroyInterviewSession } from "../interviews/interviewManager.js";

const createResponseObject = (success, data, error) => ({
	success,
	data,
	error,
});

export async function login(req, res) {
	try {
		const token = req.cookies.token;
		if (isUserLoggedIn(token)) {
			return res
				.status(409)
				.json(createResponseObject(false, null, "User already logged in. "));
		}

		const user = await verifyUser(req.body.code);
		createAuthenticationCookie(req, res, user);

		const userExists = await User.exists({ _id: user.sub });
		if (!userExists) await addUser(user.sub, user.email, user.email);

		return res.status(200).json(createResponseObject(true, null, null));
	} catch (err) {
		console.error("Login error:", err);
		return res
			.status(400)
			.json(createResponseObject(false, null, "Failed to authenticate user."));
	}
}

export function logout(req, res) {
	if (!req.cookies.token) {
		return res
			.status(400)
			.json(createResponseObject(false, null, "Not logged in."));
	}
	const userId = decodeToken(req.cookies.token).sub;
	destroyInterviewSession(userId);

	res.clearCookie("token");

	return res
		.status(200)
		.json(createResponseObject(true, null, "Successfully logged out."));
}

export function getStatus(req, res) {
	const token = req.cookies.token;
	const status = verifyAuth(token);

	if (!status) {
		return res
			.status(400)
			.json(createResponseObject(false, null, "Not logged in."));
	}

	return res
		.status(200)
		.json(createResponseObject(true, "User is logged in.", null));
}
