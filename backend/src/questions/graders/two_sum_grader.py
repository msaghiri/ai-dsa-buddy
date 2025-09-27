from solution import solution # pyright: ignore[reportMissingImports]
import json

test_cases = [		
        {
			'args': [[1, 3, 2, 5, 0], 1],
			'expected': [0, 4],
		},

		{
			'args': [[5, 3, 0, 0, 0, 1, 23], 4],
			'expected': [1, 5],
		},

		{
			'args': [[23, 21, 2, 8, 50], 10],
			'expected': [2, 3],
		},]

results = []

for i, test_case in enumerate(test_cases):
    user_output = solution(*test_case['args'])

    passed = sorted(user_output) == sorted(test_case['expected'])

    results.append({
        "case": i,
        "passed": passed,
        "output": user_output,
        "expected": test_case['expected']
    })

print(json.dumps(results))