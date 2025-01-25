import express from "express";
import { getUser, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", getUser);
router.put("/update/:userId", verifyToken, updateUser);

export default router;
