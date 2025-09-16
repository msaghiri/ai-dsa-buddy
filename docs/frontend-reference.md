---
# Frontend Services Documentation

This document describes all service functions in the frontend, including authentication, conversation handling, and code execution services. Each function includes its purpose, parameters, return value, side effects, errors, and usage examples.
---

## Table of Contents

- [AuthService](#authservice)
  - [authenticate](#authenticate)
  - [logout](#logout)
  - [verifyAuth](#verifyauth)
- [GeminiService](#geminiservice)
  - [initiateConversation](#initiateconversation)
  - [sendMessage](#sendmessage)
  - [endConversation](#endconversation)
  - [storeMessage](#storemessage)
  - [clearStorage](#clearstorage)
  - [init](#init)
- [CodeService](#codeservice)
  - [sendCodeToModel](#sendcodetomodel)

---

## AuthService

### `authenticate(authCode: string): Promise<Object>`

**Purpose:**  
Authenticates a user with the provided authorization code.

**Parameters:**

- `authCode` – `string` – The authentication code received from the frontend login flow.

**Return Value:**

- `Promise<Object>` – Resolves to an object containing at least:
  ```ts
  {
  	success: boolean;
  	// additional data returned by API
  }
  ```

````

**Side Effects:**

- Sends a POST request to `${config.API_URL}/auth/login` with credentials included.

**Errors / Exceptions:**

- Throws `Error("Authentication Error")` if API returns `success = false`.
- Throws network or fetch-related errors.

**Example Usage:**

```js
try {
	const result = await authenticate("auth-code-123");
	if (result.success) console.log("User authenticated!");
} catch (err) {
	console.error("Authentication failed:", err);
}
```

---

### `logout(): Promise<Object>`

**Purpose:**
Logs out the current user.

**Parameters:**

- None

**Return Value:**

- `Promise<Object>` – Resolves to an object containing at least:

  ```ts
  {
  	success: boolean;
  	// additional data returned by API
  }
  ```

**Side Effects:**

- Sends a POST request to `${config.API_URL}/auth/logout` with credentials included.

**Errors / Exceptions:**

- Throws `Error("Failed to Log out")` if API returns `success = false`.
- Throws network or fetch-related errors.

**Example Usage:**

```js
try {
	const result = await logout();
	if (result.success) console.log("User logged out successfully.");
} catch (err) {
	console.error("Logout failed:", err);
}
```

---

### `verifyAuth(): Promise<boolean>`

**Purpose:**
Checks if the user is currently authenticated.

**Parameters:**

- None

**Return Value:**

- `Promise<boolean>` – Resolves to `true` if authenticated, otherwise `false`.

**Side Effects:**

- Sends a GET request to `${config.API_URL}/auth/status` with credentials included.

**Errors / Exceptions:**

- Returns `false` if any error occurs during fetch.

**Example Usage:**

```js
const isAuthenticated = await verifyAuth();
console.log("User is authenticated:", isAuthenticated);
```

---

## GeminiService

### `initiateConversation(): Promise<boolean>`

**Purpose:**
Initializes a conversation with Gemini if the user is authenticated.

**Parameters:**

- None

**Return Value:**

- `Promise<boolean>` – Resolves to `true` if successful; otherwise `false`.

**Side Effects:**

- Sends a POST request to `${config.API_URL}/gemini/init-convo` with credentials included.

**Errors / Exceptions:**

- Returns `false` if user is not authenticated or any error occurs.
- Logs errors to console.

**Example Usage:**

```js
const success = await initiateConversation();
if (success) console.log("Conversation initialized.");
```

---

### `sendMessage(message: string): Promise<string | false>`

**Purpose:**
Sends a message to Gemini and retrieves the response.

**Parameters:**

- `message` – `string` – The message text to send.

**Return Value:**

- `Promise<string | false>` – Resolves to the response text if successful; otherwise `false`.

**Side Effects:**

- Sends a POST request to `${config.API_URL}/gemini/send-message` with credentials included.

**Errors / Exceptions:**

- Throws if API returns unsuccessful status or no response.
- Logs errors to console.

**Example Usage:**

```js
const response = await sendMessage("Hello Gemini!");
if (response) console.log("Gemini says:", response);
```

---

### `endConversation(): Promise<boolean>`

**Purpose:**
Terminates the current conversation with Gemini.

**Parameters:**

- None

**Return Value:**

- `Promise<boolean>` – Resolves to `true` if successful; otherwise `false`.

**Side Effects:**

- Sends a POST request to `${config.API_URL}/gemini/end-convo` with credentials included.

**Errors / Exceptions:**

- Returns `false` on failure; logs errors.

**Example Usage:**

```js
const ended = await endConversation();
if (ended) console.log("Conversation ended.");
```

---

### `storeMessage(message: Object | string): void`

**Purpose:**
Stores a message in local storage under the `conversation` key.

**Parameters:**

- `message` – `Object | string` – The message to store.

**Return Value:**

- None

**Side Effects:**

- Appends message to local storage.

**Example Usage:**

```js
storeMessage({ from: "user", text: "Hello" });
```

---

### `clearStorage(): void`

**Purpose:**
Clears all conversation data from local storage.

**Parameters:**

- None

**Return Value:**

- None

**Side Effects:**

- Removes the `conversation` key from local storage.

**Example Usage:**

```js
clearStorage();
```

---

## CodeService

### `sendCodeToModel(code: string): Promise<string | false>`

**Purpose:**
Sends a code snippet to the model via Gemini API and retrieves the response.

**Parameters:**

- `code` – `string` – The code snippet to send.

**Return Value:**

- `Promise<string | false>` – Resolves to the response text if successful; otherwise `false`.

**Side Effects:**

- Sends a POST request to `${config.API_URL}/code/send-code-to-model` with credentials included.

**Errors / Exceptions:**

- Throws if API returns unsuccessful status or no response.
- Logs errors to console; returns `false` on failure.

**Example Usage:**

```js
const response = await sendCodeToModel("console.log('Hello World');");
if (response) console.log("Model response:", response);
```

---

**Notes:**

- All API calls include `credentials: "include"`
- Functions that return `false` on error log the actual error in the console.
- Local storage functions (`storeMessage`, `clearStorage`) affect only the frontend storage.

```

---

```
````
