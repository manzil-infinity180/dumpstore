import { Router } from "express";
import {
  generateBybart,
  generateByGemini,
  genereatedTagNsummaryByAI,
} from "../controllers/aiEnhancement.js";
const router = Router();
router.post("/get-tags-summary-openai", genereatedTagNsummaryByAI);
router.post("/get-tags-summary-bart", generateBybart);
router.post("/get-tags-summary-gemini", generateByGemini);
export { router };
