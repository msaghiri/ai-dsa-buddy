import Router from "express";
import express from "express";
import { sendCodeToModel, testCode } from "../controllers/codeController.js";

const router = Router({});
router.use(express.json());

router.post("/send-code-to-model", (req, res) => {
	sendCodeToModel(req, res);
});
router.post("/run-tests", testCode);

export default router;
