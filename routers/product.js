import express from "express";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  createProductSchema,
  updateProductSchema,
  deleteProductSchema,
} from "../validations/product.js";

import {
  createProduct,
  updateProduct,
  listProducts,
  getProduct,
  deleteProduct,
} from "../controller/product.js";

const router = express.Router();

router.post("/create", validate(createProductSchema), auth, createProduct);
router.put("/update", validate(updateProductSchema), auth, updateProduct);
router.get("/list", auth, listProducts);
router.get("/findOne/:unique_id", auth, getProduct);
router.delete("/delete", validate(deleteProductSchema), auth, deleteProduct);

export default router;
