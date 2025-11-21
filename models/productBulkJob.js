import mysql from "../db/connnection.js";

export async function createBulkJobDB(data) {
  try {
    const [res] = await mysql.execute(
      `INSERT INTO products_bulk_jobs
     (job_id, file_path, total_rows, processed_rows, failed_rows, status, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.jobId ?? null,
        data.filePath ?? null,
        data.total_rows ?? 0,
        data.processed_rows ?? 0,
        data.failed_rows ?? 0,
        data.status ?? "pending",
        data.createdBy ?? null
      ]
    );
    return res;
  } catch (error) {
    console.log("error:", error)
        return {
            status: false,
            message: "Somthing went wrong",
            data: []
        };
  }
}

export async function getBulkJobDB(jobId) {
  try {
    const [rows] = await mysql.execute(
      `SELECT * FROM products_bulk_jobs WHERE job_id=? LIMIT 1`,
      [jobId]
    );
    return rows[0] || null;
  } catch (error) {
    console.log("error:", error)
        return {
            status: false,
            message: "Somthing went wrong",
            data: []
        };
  }
}

export async function updateJobStatusDB(data) {
  try {
    const [res] = await mysql.execute(
      `UPDATE products_bulk_jobs
     SET total_rows=?, processed_rows=?, failed_rows=?, status=?, updated_at=CURRENT_TIMESTAMP
     WHERE job_id=?`,
      [
        data.total_rows ?? 0,
        data.processed_rows ?? 0,
        data.failed_rows ?? 0,
        data.status ?? "processing",
        data.jobId
      ]
    );
    return res;
  } catch (error) {
    console.log("error:", error)
        return {
            status: false,
            message: "Somthing went wrong",
            data: []
        };
  }
}
