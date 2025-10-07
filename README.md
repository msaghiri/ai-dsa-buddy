# DSA Platform

This project is a fully featured DSA platform that interviews you. It features a technical interviewer that runs on Gemini, code evaluation using custom Python grader scripts run via the Piston API, Google OAuth integration for authentication, a modern and intuitive UI, and more.

## Features

- **Gemini-powered Technical Interviewer:** The AI interviewer will ask you questions, give you hints, and walk you through the problem you choose as if it was a real interviewer. You can ask clarifying questions, explain your thought process, and receive immediate feedback on the code you've written in the editor.
- **Live Code Editor:** Write and edit your code in a built-in editor with syntax highlighting. At any time, if you choose, you can submit the code either for feedback from your AI interviewer or to run test cases and receive immediate results.
- **Code Evaluation (Coming Soon):** When you press "Run tests", a custom written Python grader will immediately run your solution function safely via the Piston API and you will immediately know which test cases you have passed/failed.
- **Google OAuth:** Secure sign-in with your Google account.

img

## Tech Stack

- Backend: The backend is written in Express.js. Grading scripts for questions are written in Python.
- Frontend: The frontend is written purely using React.js and CSS.
- Database: State information for interview sessions are stored in-memory for now. User data and (soon) other information from previous interview sessions are stored in a MongoDB database.

### Demo:

##

### Prerequisites for Setup

- Node.js and npm
- Access to Google Cloud Console to create OAuth 2.0 credentials.
- A Google Gemini API Key.
- A MongoDB database and its connection string.

### Setup

The project is split into two main parts: a `backend` (Express.js) and a `frontend` (React). You will need to set up both.

---

### 1. Backend Setup

The backend server handles user authentication, manages interview sessions, and communicates with the Gemini API.

**a. Install Dependencies:**

Navigate to the `backend` directory and install the required npm packages.

```bash
cd backend
npm install
```

**b. Configure Environment Variables:**

Create a file named `.env.local` in the `backend` directory. This file will store your secret keys and configuration variables.

```
backend/.env.local
```

Add the following key-value pairs to your `.env.local` file.

```dotenv
# Server Configuration
PORT=3000

# Google OAuth Credentials
CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET

# Gemini API Key
GEMINI_API=YOUR_GEMINI_API_KEY

# JWT Secret
JWT_SECRET=YOUR_RANDOM_JWT_SECRET_STRING

# MongoDB Connection URL
MONGOOSE_CONNECTION_URL=YOUR_MONGODB_CONNECTION_STRING
```

**c. Run the Backend Server:**

Once your environment variables are set, you can start the backend server.

```bash
npm run dev
```

The server should now be running on the port you specified in your `.env.local` file (e.g., `http://localhost:3000`).

---

### 2. Frontend Setup

The frontend is a React application built with Vite. This is what you actually see and interact with in your web browser.

**a. Install Dependencies:**

In a new terminal, navigate to the `frontend` directory and install the required npm packages.

```bash
cd frontend
npm install
```

**b. Configure Environment Variables:**

Create a file named `.env.local` in the `frontend` directory.

```
frontend/.env.local
```

Add the following key-value pairs. **Make sure `VITE_CLIENT_ID` is the **same** as the `CLIENT_ID` in the backend.**

```dotenv
# The Google Client ID for OAuth
VITE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID

# The URL of your running backend server
VITE_API_URL=http://localhost:3001
```

_Note: Vite requires environment variables exposed to the browser to be prefixed with `VITE_`.\_

**c. Run the Frontend Application:**

Start the frontend development server.

```bash
npm run dev
```

The application should now be running and accessible in your web browser, typically at `http://localhost:5173`.

---

## Usage

1.  Open the frontend application in your browser.
2.  Click the "Sign in with Google" button and sign in with your Google account.
3.  Once signed in, you will be immediately redirected to the dashboard, where you can use the app.
