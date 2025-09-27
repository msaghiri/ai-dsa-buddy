import { send } from "./interviewController.js";
import { verifyAuth, decodeToken } from "../utils/authUtils.js";
import {
	interviewSessionExists,
	getInterviewSession,
	recordAttempt,
} from "../interviews/interviewManager.js";
import fs from "fs";

export async function sendCodeToModel(req, res) {
	const code = req.body.code;
	if (!code) return res.status(400).send("No code submitted");

	const prompt = `The following code is the candidates progress so far in attempting to solve the problem. Concisely provide input in no more than 3 sentences. 
        Do not give any hints that an average interviewer wouldn't. 
        Feel free to ask a guiding question or two or to 
        provide trivial advice. This is NOT necessarily the candidates final solution, so if it is generally a step in the right direction, please do acknowledge that.
        
        ${code}`;

	try {
		req.body.message = prompt;
		await send(req, res);
	} catch (err) {
		res.status(400).send("Failed to send code");
	}
}

async function runCases(grader, solutionFunction) {
	const graderPath = `./src/questions/graders/${grader}`;

	const solutionFile = {
		name: "solution.py",
		content: solutionFunction.trim(),
	};

	const graderFile = {
		name: "grader.py",
		content: fs.readFileSync(graderPath, "utf-8"),
	};

	const bodyObject = {
		language: "python",
		version: "3.10.0",
		files: [graderFile, solutionFile],
	};

	const result = await fetch("https://emkc.org/api/v2/piston/execute", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(bodyObject),
	});

	const data = await result.json();

	if (data.run.code !== 0) {
		return {
			passed: false,
			error: data.run.stderr,
		};
	}

	const results = JSON.parse(data.run.output);

	return results;
}

export async function testCode(req, res) {
	const token = req.cookies.token;

	if (!verifyAuth(token))
		return res.status(401).json({
			success: false,
			msg: "User not logged in, could not run code.",
		});
	try {
		const userInformation = decodeToken(token);
		if (!userInformation) throw new Error("Failed to verify user.");

		if (!interviewSessionExists(userInformation.sub))
			throw new Error("User is not engaged in an interview.");

		const interviewQuestion = getInterviewSession(userInformation.sub).question;
		if (!interviewQuestion) throw new Error("Question does not exist");

		const solutionFunction = req.body.code;
		if (!solutionFunction) throw new Error("No code provided to test.");

		const testResults = await runCases(
			interviewQuestion.grader,
			solutionFunction
		);

		recordAttempt(userInformation.sub, testResults);

		res.status(200).json({
			success: true,
			data: testResults,
			msg: "",
		});
	} catch (err) {
		res.status(400).json({
			success: false,
			msg: err.message,
		});
	}
}
