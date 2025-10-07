import express from "express";
import cors from "cors";

import config from "./config.js";
import AuthRouter from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
const PORT = config.PORT || 3000;

import GeminiRouter from "./routes/geminiRoutes.js";
import CodeRouter from "./routes/codeRoutes.js";
import QuestionsRouter from "./routes/questionsRoutes.js";

import "./db/database.js";

const app = express();

const corsOptions = {
	origin: ["http://localhost:5173"],
	credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", AuthRouter);
app.use("/api/gemini", GeminiRouter);
app.use("/api/code", CodeRouter);
app.use("/api/questions", QuestionsRouter);

app.listen(PORT, "localhost", () => {
	console.log(`Server listening on port ${PORT}`);
});
