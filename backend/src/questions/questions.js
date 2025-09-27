const createQuestion = (id, name, displayName, prompt, grader, tags) => ({
	id,
	name,
	displayName,
	prompt,
	grader,
	tags,
});

const categories = {
	arrays: "hashing and arrays",
	strings: "strings",
	maps: "maps",
	sets: "sets",
	dp: "dynamic programming",
	recursion: "recursion",
};

const twoSum = createQuestion(
	0,
	"two-sum",
	"Two sum",
	`Given an array of integers, nums, and an integer, target, return the indices of the two numbers such that their sum equals target. If such two numbers do not exist, return an empty array.`,
	"two_sum_grader.py",
	[categories.arrays]
);

const questions = {
	"two-sum": twoSum,
};

export default questions;
