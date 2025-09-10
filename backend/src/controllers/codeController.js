import { send } from "./interviewController.js";

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
	//const solutionFunction = req.body.code;

	const solutionFunction = `
def solution():
	print("Hello world!")`;

	const test = `
${solutionFunction}
solution()`;

	const bodyObject = {
		language: "python",
		version: "3.10.0",
		files: [
			{
				content: test.trim(),
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
	console.log(test.trim());
	console.log(data);
}

await testCode(1, 1);
