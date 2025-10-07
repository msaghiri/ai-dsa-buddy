import { Router } from "express";
import express from "express";
import {
	getAllQuestions,
	getQuestionByName,
} from "../controllers/questionsController";

const router = Router({});
router.use(express.json());

router.get("/all", (req, res) => {
	getAllQuestions(req, res);
});
router.get("/:name", (req, res) => {
	getQuestionByName(req, res);
});

export default router;
