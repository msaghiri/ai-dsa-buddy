import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const config = {
	PORT: process.env.PORT,
	GEMINI_API: process.env.GEMINI_API,
	GEMINI_MODEL: "gemini-2.5-flash-lite",
	CLIENT_ID: process.env.CLIENT_ID,
	CLIENT_SECRET: process.env.CLIENT_SECRET,
	JWT_SECRET: process.env.JWT_SECRET,
	MONGOOSE_CONNECTION_URL: process.env.MONGOOSE_CONNECTION_URL,
	PROMPT: "",
};

export default config;
