import express from "express";
import { register, userLogin, deactivateUser, updateUser, activateUserController } from "../controller/user.js";
import { auth } from "../middleware/auth.js";
import {validate} from "../middleware/validate.js"
import {signupSchema,loginSchema, activateSchema} from "../validations/user.js"

const router = express.Router();

router.post("/signup",validate(signupSchema), register);
router.post("/login", validate(loginSchema),userLogin);

router.post("/deactivate", auth, deactivateUser);
router.post("/activate", validate(activateSchema), activateUserController);
router.put("/update", auth, updateUser);

export default router;
