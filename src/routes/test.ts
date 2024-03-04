import express from "express";
import { testController } from "../controllers";

const router = express.Router();

router.get("/testRoute", testController)

export default router;
