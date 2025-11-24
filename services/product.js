import { createProductDB, updateProductDB, listProductsDB, getProductDB, deleteProductDB, countProductsDB } from "../models/product.js";
import { createBulkJobDB, getBulkJobDB } from "../models/productBulkJob.js";
import { addToQueue } from "../utils/bulkQueue.js";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function createProductService(req) {
  try {
    req.body.unique_id = uuidv4();
    if (!req.body.sku && req.body.product_name) {
      req.body.sku = String(req.body.product_name).toLowerCase().trim().replace(/\s+/g, "-");
    }
    return await createProductDB(req.body, req.user.id);
  } catch (err) {
    console.log("error:", err);
    return { status: false, message: "Somthing went wrong", data: [] };
  }
}
export async function updateProductService(req) {
  try {
    return await updateProductDB(req.body, req.user.id);
  } catch (error) {
    console.log("error:", error);
    return { status: false, message: "Somthing went wrong", data: [] };
  }
}

export async function listProductsService(req) {
  try {
    const { page = 1, limit = 10, sort = "asc", search = "" } = req.query;
    const pagination = {
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit),
      sortByPrice: (sort === "desc") ? "desc" : (sort === "asc" ? "asc" : null),
      search,
    };
    const data = await listProductsDB(pagination);
    return { status: true, data };
  } catch (error) {
    console.log("error:", error);
    return { status: false, message: "Somthing went wrong", data: [] };
  }
}

export async function getProductService(req) {
  try {
    const data = await getProductDB(req.params.unique_id);
    if (!data) return { status: false, message: "Product not found" };
    return { status: true, data };
  } catch (error) {
    console.log("error:", error);
    return { status: false, message: "Somthing went wrong", data: [] };
  }
}

export async function deleteProductService(req) {
  try {
    const result = await deleteProductDB(req.body.unique_id);
    if (result.affectedRows === 0) return { status: false, message: "Product not found" };
    return { status: true, message: "Product deleted" };
  } catch (error) {
    console.log("error:", error);
    return { status: false, message: "Somthing went wrong", data: [] };
  }
}

export async function requestProductReportService({ userId = null, filters = {}, format = "csv" }) {
  // supports only CSV for now
  if (format !== "csv") return { status: false, message: "Unsupported format" };

  const normalized = {
    q: filters.q ?? null,
    categoryId: filters.categoryId ?? null,
    min_price: (filters.min_price !== undefined && filters.min_price !== null) ? Number(filters.min_price) : null,
    max_price: (filters.max_price !== undefined && filters.max_price !== null) ? Number(filters.max_price) : null,
    is_active: (filters.is_active !== undefined && filters.is_active !== null) ? (filters.is_active === 1 ? 1 : 0) : null
  };

  const reportsDir = path.join(process.cwd(), "reports");
  if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });
  const fileName = `report-${Date.now()}.csv`;
  const filePath = path.join(reportsDir, fileName);

  try {
    const total = await countProductsDB({ q: normalized.q, categoryId: normalized.categoryId });
    if (!total) return { status: false, message: "No data", total_rows: 0 };

    const stream = fs.createWriteStream(filePath, { encoding: "utf8" });
    const headers = ["id", "product_name", "sku", "price", "stock", "category_name", "is_active"];
    stream.write(headers.join(",") + "\n");

    const pageSize = 1000;
    for (let off = 0; off < total; off += pageSize) {
      const rows = await listProductsDB({ q: normalized.q, categoryId: normalized.categoryId, min_price: normalized.min_price, max_price: normalized.max_price, is_active: normalized.is_active, limit: pageSize, offset: off, sortByPrice: null });
      for (const r of rows) {
        const line = [
          r.id,
          escapeCsv(r.product_name),
          escapeCsv(r.sku),
          formatNumber(r.price),
          r.stock || 0,
          escapeCsv(r.category_name),
          r.is_active || 0,
        ].join(",");
        stream.write(line + "\n");
      }
    }

    await new Promise((resolve, reject) => { stream.end(() => resolve()); stream.on("error", reject); });
    return { status: true, file_path: filePath, total_rows: total };
  } catch (err) {
    try { if (fs.existsSync(filePath)) fs.unlinkSync(filePath); } catch (e) {}
    return { status: false, message: "Failed to generate report", error: String(err) };
  }
}

function escapeCsv(val) {
  if (val === null || val === undefined) return "";
  const s = String(val);
  if (s.includes(",") || s.includes('"') || s.includes("\n") || s.includes("\r")) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function formatNumber(n) {
  if (n === null || n === undefined) return "";
  return Number(n).toFixed(2);
}

export const productListService = listProductsService;

export async function startBulkUploadService(req) {
  try {
    const file = req.file;
    if (!file) return { status: false, message: "No file uploaded" };

    const jobId = uuidv4();
    const filePath = file.path || (file.destination ? path.join(file.destination, file.filename) : null);

    await createBulkJobDB({
      jobId,
      filePath,
      total_rows: 0,
      processed_rows: 0,
      failed_rows: 0,
      status: "pending",
      createdBy: req.user && req.user.id ? req.user.id : null,
    });

    addToQueue({ jobId });

    return { status: true, jobId };
  } catch (err) {
    console.log("startBulkUploadService error:", err);
    return { status: false, message: "Failed to start bulk upload", error: String(err) };
  }
}

export async function bulkUploadStatusService(jobId) {
  try {
    const job = await getBulkJobDB(jobId);
    if (!job) return { status: false, message: "Job not found" };
    return { status: true, data: job };
  } catch (err) {
    console.log("bulkUploadStatusService error:", err);
    return { status: false, message: "Failed to fetch job status", error: String(err) };
  }

}