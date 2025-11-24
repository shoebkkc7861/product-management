import express from "express";
import { auth } from "../middleware/auth.js";
import { createCategory, updateCategory, listCategories, getCategory,deleteCategory } from "../controller/category.js";
import {validate} from "../middleware/validate.js"
import {updateCategorySchema,createCategorySchema,deleteCategorySchema} from "../validations/category.js"

const router = express.Router();

router.post("/create", validate(createCategorySchema),auth, createCategory);
router.put("/update", validate(updateCategorySchema),auth, updateCategory);
router.get("/listCategories", auth, listCategories);
router.get("/findOne/:uuid", auth, getCategory);
router.delete("/delete",validate(deleteCategorySchema), auth, deleteCategory);

export default router;
