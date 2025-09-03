//import mongoose from "./database.js";
import { User } from "../models/User.js";

export async function addUser(userId, displayName, email) {
	try {
		const userCurrentlyExists = User.exists(userId);

		if (userCurrentlyExists) {
			throw new Error("User already exists");
		}

		await User.create({
			_id: userId,
			displayName,
			email,
		});
	} catch (err) {
		throw err;
	}
}

export async function findUserById(userId) {
	try {
		const findUser = await User.findById(userId);
	} catch (err) {
		throw err;
	}

	return findUser;
}

export async function removeUser() {}
