import { Router } from "express";
import express from "express";
import cookieParser from "cookie-parser";
import { login, logout } from "../controllers/authController.js";
import { verifyAuth } from "../utils/authUtils.js";

const router = Router({});
router.use(express.json());
router.use(cookieParser());

router.post("/login", login);
router.post("/logout", logout);
router.get("/status", (req, res) => {
	const token = req.cookies.token;
	const status = verifyAuth(token);

	if (!status) {
		return res.status(400).json({
			success: false,
			msg: null,
			error: "Failed to authenticate",
		});
	}

	return res.status(200).json({
		success: true,
		msg: "Authenticated successfully",
		error: null,
	});
});

export default router;
