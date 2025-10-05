import { Router } from "express";

import {
	initInterview,
	send,
	endInterview,
	interviewExists,
} from "../controllers/interviewController.js";

const router = Router();

router.post("/init-convo", (req, res) => {
	initInterview(req, res);
});

router.post("/send-message", (req, res) => {
	send(req, res);
});

router.post("/end-convo", (req, res) => {
	endInterview(req, res);
});

router.get("/convo-exists", (req, res) => {
	interviewExists(req, res);
});

//Unimportant for now
router.post("/chat-history", (req, res) => {});

export default router;
