const createQuestion = (id, name, displayName, prompt, grader, tags) => ({
	id,
	name,
	displayName,
	prompt,
	grader,
	tags,
});

const categories = {
	arrays: "Hashing and Arrays",
	strings: "Strings",
	maps: "Maps",
	sets: "Sets",
	dp: "Dynamic Programming",
	recursion: "Recursion",
};

const twoSum = createQuestion(
	0,
	"two-sum",
	"Two sum",
	`Given an array of integers, nums, and an integer, target, return the indices of the two numbers such that their sum equals target. If such two numbers do not exist, return an empty array.`,
	"two_sum_grader.py",
	[categories.arrays, categories.sets]
);

const validAnagram = createQuestion(
	1,
	"valid-anagram",
	"Valid Anagram",
	`Given two strings s and t, return true if t is an anagram of s, and false otherwise.`,
	"valid_anagram_grader.py",
	[categories.strings, categories.maps]
);

const longestSubstring = createQuestion(
	2,
	"longest-substring",
	"Longest Substring...",
	`Given a string s, find the length of the longest substring without repeating characters.`,
	"longest_substring_grader.py",
	[categories.strings, categories.sets]
);

const questions = {
	"two-sum": twoSum,
	"valid-anagram": validAnagram,
	"longest-substring": longestSubstring,
};

export function allQuestions() {
	return Object.entries(questions).map(([key, question]) => ({
		id: question.id,
		name: key,
		displayName: question.displayName,
		prompt: question.prompt,
		tags: question.tags,
	}));
}

export function questionByName(name) {
	const question = questions[name];

	if (!question) {
		return null;
	}

	return {
		id: question.id,
		name,
		displayName: question.displayName,
		prompt: question.prompt,
	};
}

export default questions;
