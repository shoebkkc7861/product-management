import {   createProductService,   updateProductService,   productListService,   getProductService,   deleteProductService,startBulkUploadService,bulkUploadStatusService,requestProductReportService } from "../services/product.js";
import path from "path";
import fs from "fs";


export async function createProduct(req, res) {
  const result = await createProductService(req);
  return res.json(result);
}

export async function updateProduct(req, res) {
  const result = await updateProductService(req);
  return res.json(result);
}

export async function productListController(req, res) {
  try {
    const result = await productListService(req);
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, message: "Server error" });
  }
}

export async function getProduct(req, res) {
  const result = await getProductService(req);
  return res.json(result);
}

export async function deleteProduct(req, res) {
  const result = await deleteProductService(req);
  return res.json(result);
}


export async function bulkUploadController(req, res) {
  const result = await startBulkUploadService(req);
  res.json(result);
}

export async function bulkUploadStatusController(req, res) {
  const result = await bulkUploadStatusService(req.params.jobId);
  res.json(result);
}



export async function requestProductReportController(req, res) {
  try {
    // body: { format: "csv", filters: { category_id: 3, min_price: 100, max_price: 50000, q: "term", is_active: 1 } }
    const { format = "csv" } = req.body || {};
    const rawFilters = (req.body && req.body.filters && typeof req.body.filters === 'object') ? req.body.filters : req.body || {};

    const filters = {};
    filters.q = rawFilters.q ?? rawFilters.search ?? null;
    filters.categoryId = rawFilters.category_id ?? rawFilters.categoryId ?? null;
    filters.min_price = rawFilters.min_price !== undefined ? Number(rawFilters.min_price) : 0; 
    filters.max_price = rawFilters.max_price !== undefined ? Number(rawFilters.max_price) : null; 
    if (rawFilters.is_active !== undefined && rawFilters.is_active !== null && rawFilters.is_active !== '') {
      const v = rawFilters.is_active;
      filters.is_active = (v === 1 || v === '1' || v === true) ? 1 : 0;
    } else {
      filters.is_active = null;
    }

    if (!["csv"].includes(format)) { 
      return res.status(400).json({ status: false, message: "Unsupported format. Only 'csv' allowed." });
    }

    const userId = req.user && req.user.id ? req.user.id : null;

    const result = await requestProductReportService({ userId, filters, format });
    if (!result.status) {
      return res.status(500).json(result);
    }

    if (result.file_path && fs.existsSync(result.file_path)) {
      return res.download(path.resolve(result.file_path));
    }

    return res.json(result);
  } catch (err) {
    console.error("requestProductReportController:", err);
    return res.status(500).json({ status: false, message: "Server error while creating report", error: String(err) });
  }
}

