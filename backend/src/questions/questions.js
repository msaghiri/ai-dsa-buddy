const createQuestion = (id, name, displayName, prompt, testCases, tags) => ({
	id,
	name,
	displayName,
	prompt,
	testCases,
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
	[
		{
			args: `[1, 3, 2, 5, 0], 1`,
			expectedAnswer: `[0, 4]`,
		},

		{
			args: `[5, 3, 0, 0, 0, 1, 23], 4`,
			expectedAnswer: `[1, 5]`,
		},

		{
			args: `[23, 21, 2, 8, 50], 10`,
			expectedAnswer: `[2, 3]`,
		},
	],
	[categories.arrays]
);

export function createTestPayload(solutionFunction, args, expectedAnswer) {
	return `
${solutionFunction}

user_output = solution(${args})
expected_outcome = ${expectedAnswer}

if sorted(user_output) == (expected_outcome):
  print(True)
else:
  print(f'{user_output} , expected {expected_outcome}')
	`;
}

const questions = {
	"two-sum": twoSum,
};

export default questions;
