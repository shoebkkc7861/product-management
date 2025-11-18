import express from "express";
import { register, userLogin, deleteUser, updateUser } from "../controller/user.js";
import { auth } from "../middleware/auth.js";
import {validate} from "../middleware/validate.js"
import {signupSchema,loginSchema} from "../validations/user.js"

const router = express.Router();

router.post("/signup",validate(signupSchema), register);
router.post("/login", validate(loginSchema),userLogin);

router.delete("/delete", auth, deleteUser);
router.put("/update", auth, updateUser);

export default router;
