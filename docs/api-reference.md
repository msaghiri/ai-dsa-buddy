```markdown
## Authentication API

**Base URL:**
```

example-domain.com/api/auth

````

Authentication is handled via a secure `token` cookie. All requests that require authentication must include this cookie.

---

## Routes and Controller Functions

### POST /auth/login
**Controller:** `login`

**Description:**
Authenticates a user using a one-time authorization code. If authentication is successful, a session token is created and set as a cookie. If the user does not exist in the database, a new user record is created.

**Request Body:**
```json
{
  "code": "string"
}
````

- `code`: Required. A one-time authorization code provided by the identity provider.

**Responses:**

- `200 OK` — Authentication successful.

  ```json
  {
  	"success": true,
  	"data": null,
  	"error": null
  }
  ```

- `200 OK` — Authentication failed.

  ```json
  {
  	"success": false,
  	"data": null,
  	"error": "Failed to authenticate user."
  }
  ```

- `409 Conflict` — User already logged in.

  ```json
  {
  	"success": false,
  	"data": null,
  	"error": "User already logged in."
  }
  ```

---

### POST /auth/logout

**Controller:** `logout`

**Description:**
Logs out the current user by clearing the authentication token cookie and destroying any active interview session associated with the user.

**Cookies:**

- `token=<JWT>` — Required for identifying the session to log out.

**Responses:**

- `200 OK` — Successfully logged out.

  ```json
  {
  	"success": true,
  	"data": null,
  	"error": "Successfully logged out."
  }
  ```

- `400 Bad Request` — User not logged in.

  ```json
  {
  	"success": false,
  	"data": null,
  	"error": "Not logged in."
  }
  ```

---

### GET /auth/status

**Controller:** `getStatus`

**Description:**
Checks whether the current user's session token is valid and returns the authentication status.

**Cookies:**

- `token=<JWT>` — Required to check authentication status.

**Responses:**

- `200 OK` — Authenticated.

  ```json
  {
  	"success": true,
  	"data": "",
  	"error": null
  }
  ```

- `400 Bad Request` — Not authenticated.

  ```json
  {
  	"success": false,
  	"data": null,
  	"error": "Not logged in."
  }
  ```

---

# Authentication Utilities (`authUtils.js`)

This module contains helper functions for authentication, token management, and session handling. It also handles Google OAuth2 verification and JWT creation.

---

## `client`

**Description:**
OAuth2 client used to verify Google authorization codes and obtain user tokens.

**Type:** `OAuth2Client`

**Configuration:**

- `clientId`: From `config.CLIENT_ID`
- `clientSecret`: From `config.CLIENT_SECRET`
- `redirectUri`: `"http://localhost:5173"` (development)

---

## `createJWT(user)`

**Description:**
Generates a signed JSON Web Token (JWT) for the given user object.

**Parameters:**

- `user` (Object): User information object containing at least `userId` and `email`.

**Returns:**

- `string` — Signed JWT with:

  - `issuer`: `"myapp.com"`
  - `audience`: `"ai_dsa_buddy"`
  - `subject (sub)`: `user.userId`
  - `expiresIn`: 4 hours
  - `jwtid`: Unique UUID v4

**Side Effects:** None

---

## `verifyToken(token)`

**Description:**
Verifies a JWT and returns a detailed verification object.

**Parameters:**

- `token` (string): JWT to verify

**Returns:**

```js
{
  valid: boolean,       // true if token is valid
  isExpired: boolean,   // true if token has expired
  payload: Object|null, // decoded JWT payload
  error: Error|null     // verification error if any
}
```

---

## `decodeToken(token)`

**Description:**
Decodes and verifies a JWT, returning the payload. Throws an error if the token is invalid or expired.

**Parameters:**

- `token` (string): JWT to decode

**Returns:**

- `Object` — Decoded payload, typically contains `sub` (userId), `iat`, and `exp`.

**Throws:**

- Error if token is invalid or verification fails.

---

## `verifyUser(code)`

**Description:**
Verifies a Google OAuth2 one-time authorization code. Checks token issuer and email verification status.

**Parameters:**

- `code` (string): Authorization code received from Google OAuth2

**Returns:**

- `Promise<Object>` — User object with:

  ```js
  {
    userId: string, // Google user ID
    email: string   // Verified email
  }
  ```

**Throws:**

- Error if token is invalid, issuer is incorrect, or email is unverified

---

## `verifyAuth(token)`

**Description:**
Checks if a JWT token is valid and not expired.

**Parameters:**

- `token` (string): JWT token to check

**Returns:**

- `boolean` — `true` if valid and not expired, otherwise `false`

---

## `isUserLoggedIn(token)`

**Description:**
Determines if a user is currently logged in based on a token.

**Parameters:**

- `token` (string | undefined): JWT token from cookies

**Returns:**

- `boolean` — `true` if user is logged in, otherwise `false`

---

## `createAuthenticationCookie(req, res, user)`

**Description:**
Creates a JWT for the user and sets it as a secure, HTTP-only cookie on the response.

**Parameters:**

- `req` (Request): Express request object
- `res` (Response): Express response object
- `user` (Object): User object with at least `userId` and `email`

**Side Effects:**

- Sets `token` cookie on response with:

  - `httpOnly`: `true`
  - `secure`: `true` in production
  - `sameSite`: `"Lax"`
  - `maxAge`: 4 hours

**Throws:**

- Error if token generation or cookie setting fails

---

```markdown
# Gemini Interview Controller API

**Base URL:**
```

example-domain.com/api/auth

````

All routes require a valid authentication token (`token` cookie).

---

## Routes and Controller Functions

### POST /interview/init-convo
**Controller:** `initInterview`

**Description:**
Initializes a new interview session for the authenticated user. Prevents multiple simultaneous sessions for the same user.

**Cookies:**
- `token=<JWT>` — Required for authentication.

**Request Body:**
- Optional session parameters may be provided (e.g., topic, difficulty) depending on implementation.

**Responses:**
- `200 OK` — Session initiated successfully.
  ```json
  {
    "success": true,
    "msg": "Successfully initiated interview"
  }
````

- `400 Bad Request` — Failed to initiate session (e.g., user already in session or verification failure).

  ```json
  {
  	"success": false,
  	"msg": "Failed to initiate interview, <error message>"
  }
  ```

- `401 Unauthorized` — Invalid or missing authentication token.

---

### POST /interview/send-message

**Controller:** `send`

**Description:**
Sends a message to the active interview session. Returns the AI’s response.

**Cookies:**

- `token=<JWT>` — Required for authentication.

**Request Body:**

```json
{
	"message": "string"
}
```

- `message` — The message to send to the interview AI.

**Responses:**

- `200 OK` — Message processed successfully.

  ```json
  {
  	"success": true,
  	"response": "<AI response>"
  }
  ```

- `400 Bad Request` — Failed to send message (e.g., missing message, session error).

  ```json
  {
  	"success": false,
  	"msg": "Failed to send message, <error message>"
  }
  ```

- `401 Unauthorized` — Invalid or missing authentication token.

---

### POST /interview/end-convo

**Controller:** `endInterview`

**Description:**
Terminates the current interview session and clears session data.

**Cookies:**

- `token=<JWT>` — Required for authentication.

**Responses:**

- `200 OK` — Session terminated successfully.

  ```json
  {
  	"success": true,
  	"msg": "Interview session successfully terminated"
  }
  ```

- `400 Bad Request` — Failed to terminate session (e.g., session does not exist).

  ```json
  {
  	"success": false,
  	"msg": "Failed to terminate interview session, <error message>"
  }
  ```

- `401 Unauthorized` — Invalid or missing authentication token.

```

```

# Gemini Interview Manager (`interviewManager.js`)

This module manages active interview sessions using the Google Gemini AI. It handles session creation, message sending, and session termination for each user.

---

## Constants

### `ai`

Instance of `GoogleGenAI` used to create and interact with interview chat sessions.

### `interviewSessions`

Object that stores all active interview sessions, keyed by `userId`.

---

## Functions

### `interviewSessionExists(userId)`

**Description:**  
Checks if an active interview session exists for a given user.

**Parameters:**

- `userId` (string): Unique identifier for the user.

**Returns:**

- `boolean` — `true` if a session exists, `false` otherwise.

---

### `initiateInterviewSession(userId)`

**Description:**  
Creates a new interview session for the user. Prevents multiple simultaneous sessions.

**Parameters:**

- `userId` (string): Unique identifier for the user.

**Returns:**

- `boolean` — `true` if a new session was successfully created, `false` if a session already exists.

**Side Effects:**

- Creates a new session in `interviewSessions` using the configured Gemini AI model and system instruction.

---

### `sendMessage(userId, message)`

**Description:**  
Sends a message to the active interview session for a user and returns the AI's response.

**Parameters:**

- `userId` (string): Unique identifier for the user.
- `message` (string): User’s message to the AI.

**Returns:**

- `Promise<string>` — AI-generated response text.
- Returns `"Interview session does not exist"` if no active session is found.

---

### `destroyInterviewSession(userId)`

**Description:**  
Terminates the active interview session for the specified user.

**Parameters:**

- `userId` (string): Unique identifier for the user.

**Returns:**

- `boolean` — `true` if the session was successfully destroyed, `false` if no session existed.

**Side Effects:**

- Removes the user’s session from `interviewSessions`.

---

# User Repository (`userRepository.js`)

This module provides functions to interact with the `User` model in the database, including adding, retrieving, and removing users.

---

## Functions

### `addUser(userId, displayName, email)`

**Description:**  
Adds a new user to the database if they do not already exist. Uses an "upsert" operation to ensure no duplicate entries.

**Parameters:**

- `userId` (string): Unique identifier for the user.
- `displayName` (string): Display name of the user.
- `email` (string): Email address of the user.

**Returns:**

- `Promise<void>` — Resolves once the operation completes.

**Side Effects:**

- Inserts a new user document if one with the given `userId` does not already exist.

---

### `findUserById(userId)`

**Description:**  
Retrieves a user from the database by their unique identifier.

**Parameters:**

- `userId` (string): Unique identifier for the user.

**Returns:**

- `Promise<User>` — Resolves with the user object if found.

**Throws:**

- Error if no user with the given `userId` exists.

---

### `removeUser(userId)`

**Description:**  
Intended to remove a user from the database. (Currently unimplemented.)

**Parameters:**

- `userId` (string): Unique identifier for the user.

**Returns:**

- Not implemented.
