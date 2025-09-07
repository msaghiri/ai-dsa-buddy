import { send } from "./conversationController.js";

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

export async function testCode(req, res) {} //not a priority right now, TODO feature
