import { Router } from "express";

import {
	initConvo,
	send,
	getHistory,
	endConvo,
} from "../controllers/conversationController.js";

const router = Router();

router.post("/init-convo", (req, res) => {
	initConvo(req, res);
});

router.post("/send-message", (req, res) => {
	send(req, res);
});

router.post("/end-convo", (req, res) => {
	endConvo(req, res);
});

//Unimportant for now
router.post("/chat-history", (req, res) => {
	getHistory(req, res);
});

export default router;
