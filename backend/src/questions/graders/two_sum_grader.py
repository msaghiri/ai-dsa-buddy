from solution import solution # pyright: ignore[reportMissingImports]
import json

test_cases = [		
        {
			'args': [[1, 3, 2, 5, 0], 1],
			'expectedResult': [0, 4],
		},

		{
			'args': [[5, 3, 0, 0, 0, 1, 23], 4],
			'expectedResult': [1, 5],
		},

		{
			'args': [[23, 21, 2, 8, 50], 10],
			'expectedResult': [2, 3],
		},]

results = []

for i, test_case in enumerate(test_cases):
    user_output = solution(*test_case['args'])

    passed = sorted(user_output) == sorted(test_case['expectedResult'])

    results.append({
        "case": i,
        "passed": passed,
        "result": user_output,
        "expectedResult": test_case['expectedResult']
    })

print(json.dumps(results))