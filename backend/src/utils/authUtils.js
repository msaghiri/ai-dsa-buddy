import { v4 } from "uuid";
import jwt from "jsonwebtoken";
import config from "../config.js";
import { OAuth2Client } from "google-auth-library";

export const client = new OAuth2Client({
	clientId: config.CLIENT_ID,
	clientSecret: config.CLIENT_SECRET,
	redirectUri: "http://localhost:5173",
});

export function createJWT(user) {
	const token = jwt.sign(user, config.JWT_SECRET, {
		expiresIn: "4h",
		issuer: "myapp.com",
		audience: "ai_dsa_buddy",
		sub: user.userId,
		jwtid: v4(),
	});

	return token;
}

export function verifyToken(token) {
	const verificationObject = {
		valid: false,
		isExpired: false,
		payload: null,
		error: null,
	};

	try {
		const decoded = jwt.verify(token, config.JWT_SECRET);
		verificationObject.valid = true;
		verificationObject.payload = decoded;
	} catch (err) {
		if (err.name === "TokenExpiredError") {
			verificationObject.isExpired = true;
		}
		verificationObject.error = err;
	}

	return verificationObject;
}

export function decodeToken(token) {
	if (!verifyAuth(token)) throw new Error("Invalid token");

	try {
		const userInformation = jwt.verify(token, config.JWT_SECRET);
		return userInformation;
	} catch (err) {
		throw err;
	}
}

export async function verifyUser(code) {
	try {
		const { tokens } = await client.getToken(code);

		const ticket = await client.verifyIdToken({
			idToken: tokens.id_token,
			audience: config.CLIENT_ID,
		});

		const payload = ticket.getPayload();

		if (
			payload.iss !== "accounts.google.com" &&
			payload.iss !== "https://accounts.google.com"
		) {
			throw new Error("Invalid token issuer");
		}
		if (!payload.email_verified) {
			throw new Error("Email not verified");
		}

		return {
			userId: payload.sub,
			email: payload.email,
		};
	} catch (err) {
		console.log(err);
		throw err;
	}
}

export function verifyAuth(token) {
	const res = verifyToken(token);
	return res.valid && !res.isExpired;
}

export function isUserLoggedIn(token) {
	if (token) {
		const result = verifyToken(token);

		if (result.valid && !result.isExpired) {
			return true;
		}
	}

	return false;
}

export function createAuthenticationCookie(req, res, user) {
	try {
		const newToken = createJWT(user);

		res.cookie("token", newToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "Lax",
			maxAge: 1000 * 60 * 60 * 4,
		});
	} catch (err) {
		throw new Error(
			"Failed to Authenticate User -- Failed to set Authentication Cookie"
		);
	}
}
