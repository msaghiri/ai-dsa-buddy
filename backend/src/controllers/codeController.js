import { send } from "./interviewController.js";
import { verifyAuth, decodeToken } from "../utils/authUtils.js";
import {
	interviewSessionExists,
	getInterviewSession,
} from "../interviews/interviewManager.js";
import { createTestPayload } from "../questions/questions.js";

export async function sendCodeToModel(req, res) {
	const code = req.body.code;
	if (!code) return res.status(400).send("No code submitted");

	const prompt = `The following code is Users progress so far in attempting to solve the problem. Concisely provide input in no more than 3 sentences. 
        Do not give any hints that an average interviewer wouldn't. 
        Feel free to ask a guiding question or two or to 
        provide trivial advice. This is NOT necessarily Users final solution, so if it is generally a step in the right direction, do acknowledge that.
        
        ${code}`;

	try {
		req.body.message = prompt;
		await send(req, res);
	} catch (err) {
		res.status(400).send("Failed to send code");
	}
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
		const testCase = interviewQuestion.testCases[0];

		const solutionFunction = req.body.code;
		if (!solutionFunction) throw new Error("No code provided to test.");

		const testPayload = createTestPayload(
			solutionFunction,
			testCase.args,
			testCase.expectedAnswer
		);

		const bodyObject = {
			language: "python",
			version: "3.10.0",
			files: [
				{
					content: testPayload.trim(),
				},
			],
		};

		const result = await fetch("https://emkc.org/api/v2/piston/execute", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(bodyObject),
		});
		const data = await result.json();
		res.status(200).json({
			success: true,
			data: data.run.output,
		});
	} catch (err) {
		res.status(400).json({
			success: false,
			msg: err.message,
		});
	}
}
