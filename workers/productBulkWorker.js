import fs from "fs";
import csv from "csv-parser";

import {
  getBulkJobDB,
  updateJobStatusDB
} from "../models/productBulkJob.js";

import { createProductService } from "../services/product.js";

export default async function productBulkWorker({ jobId }) {
  const jobData = await getBulkJobDB(jobId);
  if (!jobData) return;

  let total = 0;
  let processed = 0;
  let failed = 0;

  // Mark as processing
  await updateJobStatusDB({
    jobId,
    total_rows: 0,
    processed_rows: 0,
    failed_rows: 0,
    status: "processing"
  });

  const filePath = jobData.file_path;

  // Stream and process rows as they are parsed to avoid buffering large files
  const parser = fs.createReadStream(filePath).pipe(csv());

  try {
    for await (const row of parser) {
      total++;

      const req = { user: {}, body: {} };
      req.body = row;
      req.user.id = jobData.created_by;

      try {
        const res = await createProductService(req);
        if (res && res.status) processed++;
        else failed++;
      } catch (err) {
        failed++;
      }

      // Periodically update progress to the DB (every 50 rows)
      if ((processed + failed) % 50 === 0) {
        await updateJobStatusDB({
          jobId,
          total_rows: total,
          processed_rows: processed,
          failed_rows: failed,
          status: "processing"
        });
      }
    }

    await updateJobStatusDB({
      jobId,
      total_rows: total,
      processed_rows: processed,
      failed_rows: failed,
      status: "completed"
    });
  } catch (err) {
    // mark job as failed and record current progress
    try {
      await updateJobStatusDB({
        jobId,
        total_rows: total,
        processed_rows: processed,
        failed_rows: failed,
        status: "failed"
      });
    } catch (e) {
      console.log("Failed to update job status to failed:", e);}
    throw err;
  }
}
