import express from "express";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {createProductSchema,updateProductSchema,deleteProductSchema} from "../validations/product.js";

import { createProduct, updateProduct, productListController, getProduct, deleteProduct, bulkUploadController,bulkUploadStatusController,requestProductReportController,} from "../controller/product.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/create", validate(createProductSchema), auth, createProduct);
router.put("/update", validate(updateProductSchema), auth, updateProduct);
router.get("/findOne/:unique_id", auth, getProduct);
router.delete("/delete", validate(deleteProductSchema), auth, deleteProduct);
router.post("/bulk-upload", auth, upload.single("file"), bulkUploadController);
router.get("/bulk-upload/status/:jobId", auth, bulkUploadStatusController);
router.get("/list", productListController);
router.post("/report", auth, requestProductReportController);

export default router;
