import ProtectedRoutes from "./pages/ProtectedRoutes";
import LoginPage from "./pages/LoginPage/LoginPage.jsx";
import InterviewPage from "./pages/InterviewPage/InterviewPage.jsx";
import DashboardPage from "./pages/DashboardPage/DashboardPage.jsx";

import NavigationBar from "./components/NavigationBar/NavigationBar.jsx";

import "./index.css";

import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export function App() {
	return (
		<div className="app">
			<NavigationBar />
			<Routes>
				{/*<Route path="/" element={<Navigate to="/interview" />} />*/}
				<Route path="/" element={<DashboardPage />} />
				<Route path="login" element={<LoginPage />} />
				{<Route path="interview" element={<InterviewPage />} />}
				<Route element={<ProtectedRoutes />}>
					{/*<Route path="interview" element={<InterviewPage />} />*/}
				</Route>
			</Routes>
		</div>
	);
}

export default App;
