import express from "express";
import { register, userLogin, deleteUser, updateUser } from "../controller/user.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", register);
router.post("/login", userLogin);

router.delete("/delete", auth, deleteUser);
router.put("/update", auth, updateUser);

export default router;
