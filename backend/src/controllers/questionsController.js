import { isUserLoggedIn } from "../utils/authUtils";
import { allQuestions, questionByName } from "../questions/questions";

export function getAllQuestions(req, res) {
	const token = req.cookies.token;

	if (!isUserLoggedIn(token)) {
		return res.status(400).json({
			success: true,
			data: "",
			error: "Not logged in.",
		});
	}

	const questions = allQuestions();

	if (!questions) {
		return res.status(400).json({
			success: false,
			data: "",
			error: "Unable to fetch questions.",
		});
	}

	return res.status(200).json({
		success: true,
		data: questions,
		error: "",
	});
}
export function getQuestionByName(req, res) {
	const token = req.cookies.token;

	if (!isUserLoggedIn(token)) {
		return res.status(400).json({
			success: false,
			data: "",
			error: "Not logged in.",
		});
	}

	const name = req.params["name"];
	if (!name) {
		return res.status(400).json({
			success: false,
			data: "",
			error: "Could not find question.",
		});
	}

	const question = questionByName(name);

	if (!question) {
		return res.status(400).json({
			success: false,
			data: "",
			error: "Could not find question.",
		});
	}

	return res.status(200).json({
		success: true,
		data: question,
		error: "",
	});
}
