import ProtectedRoutes from "./pages/ProtectedRoutes";
import LoginPage from "./pages/LoginPage/LoginPage.jsx";
import ConversationPage from "./pages/ConversationPage/ConversationPage.jsx";

import NavigationBar from "./components/NavigationBar/NavigationBar.jsx";

import "./index.css";

import { Routes, Route, Navigate } from "react-router-dom";

export function App() {
	return (
		<div className="app">
			<NavigationBar />
			<Routes>
				<Route path="login" element={<LoginPage />} />
				<Route path="conversation" element={<ConversationPage />} />
				<Route element={<ProtectedRoutes />}>
					<Route path="/" element={<Navigate to="/conversation" />} />
				</Route>
			</Routes>
		</div>
	);
}

export default App;
