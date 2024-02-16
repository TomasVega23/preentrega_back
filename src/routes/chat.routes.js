import { Router } from "express";
import { ChatController } from "../controllers/chat.controller.js";


const router = Router();

router.get("/", ChatController.GetChat);

router.post("/", ChatController.PostChat);

export default router;