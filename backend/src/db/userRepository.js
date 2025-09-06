import { User } from "../models/User.js";

export async function addUser(userId, displayName, email) {
	await User.updateOne(
		{ _id: userId },
		{ $setOnInsert: { displayName, email } },
		{ upsert: true }
	);
}

export async function findUserById(userId) {
	const user = await User.findById(userId);
	if (!user) {
		throw new Error("Failed to find user");
	}
	return user;
}

export async function removeUser() {}
