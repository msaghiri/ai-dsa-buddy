from solution import solution # pyright: ignore[reportMissingImports]
import json

test_cases = [
    {
        "args": ["abcabcbb"],
        "expectedResult": 3
    },
    {
        "args": ["bbbbb"],
        "expectedResult": 1
    },
    {
        "args": ["pwwkew"],
        "expectedResult": 3
    },
    {
        "args": [""],
        "expectedResult": 0
    },
    {
        "args": ["dvdf"],
        "expectedResult": 3
    },
    {
        "args": ["anviaj"],
        "expectedResult": 5
    },
    {
        "args": ["aab"],
        "expectedResult": 2
    },
    {
        "args": ["tmmzuxt"],
        "expectedResult": 5
    },
    {
        "args": ["abba"],
        "expectedResult": 2
    },
    {
        "args": ["abcdefghijklmnopqrstuvwxyz"],
        "expectedResult": 26
    }
]

results = []

for i, test_case in enumerate(test_cases):
    user_output = solution(*test_case['args'])

    passed = sorted(user_output) == test_case['expectedResult']

    results.append({
        "case": i,
        "passed": passed,
        "result": user_output,
        "expectedResult": test_case['expectedResult']
    })

print(json.dumps(results))