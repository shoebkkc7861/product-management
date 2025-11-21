const queue = [];
let isRunning = false;

export function addToQueue(job) {
  queue.push(job);
  processQueue();
}

async function processQueue() {
  if (isRunning) return;

  isRunning = true;

  while (queue.length > 0) {
    const job = queue.shift();
    const worker = await import("../workers/productBulkWorker.js");
    await worker.default(job);
  }

  isRunning = false;
}
