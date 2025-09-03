import mongoose from "mongoose";
import config from "../config.js";

export async function init() {
	try {
		await mongoose.connect(config.MONGOOSE_CONNECTION_URL);
	} catch (err) {
		console.log("Failed to connect to the database");
	}
}

init();

export default mongoose;
