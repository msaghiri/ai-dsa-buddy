import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
	_id: String,
	displayName: String,
	email: String,
});

export const User = mongoose.model("User", UserSchema);
