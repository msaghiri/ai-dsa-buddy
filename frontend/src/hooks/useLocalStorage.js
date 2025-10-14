import { useState, useEffect } from "react";

function getStoredValue(key, initialValue) {
	const value = localStorage.getItem(key);
	if (value === null) return initialValue;

	try {
		return JSON.parse(value);
	} catch (err) {
		console.error(`Failed to parse ${key}`);
		return initialValue;
	}
}

function useLocalStorage(key, initialValue) {
	const [value, setValue] = useState(() => getStoredValue(key, initialValue));

	useEffect(() => {
		localStorage.setItem(key, JSON.stringify(value));
	}, [key, value]);

	return [value, setValue];
}

export default useLocalStorage;
