from solution import solution  # pyright: ignore[reportMissingImports]
import json

test_cases = [
    {
        "args": ["anagram", "nagaram"],
        "expectedResult": True
    },
    {
        "args": ["rat", "car"],
        "expectedResult": False
    },
    {
        "args": ["listen", "silent"],
        "expectedResult": True
    },
    {
        "args": ["aabbcc", "abcabc"],
        "expectedResult": True
    },
    {
        "args": ["aabbcc", "aabbc"],
        "expectedResult": False
    },
    {
        "args": ["", ""],
        "expectedResult": True
    },
    {
        "args": ["abcd", "dcba"],
        "expectedResult": True
    },
    {
        "args": ["abcd", "abce"],
        "expectedResult": False
    },
    {
        "args": ["a", "a"],
        "expectedResult": True
    },
    {
        "args": ["a", "b"],
        "expectedResult": False
    }
]

results = []

for i, test_case in enumerate(test_cases):
    user_output = solution(*test_case['args'])

    passed = user_output == test_case['expectedResult']

    results.append({
        "case": i,
        "passed": passed,
        "result": user_output,
        "expectedResult": test_case['expectedResult']
    })

print(json.dumps(results))