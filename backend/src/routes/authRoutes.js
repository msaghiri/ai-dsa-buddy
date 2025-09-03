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
		return res.status(400).send(status);
	}

	return res.status(200).send(status);
});

export default router;
