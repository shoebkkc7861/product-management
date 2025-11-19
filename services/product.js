import { createProductDB, updateProductDB, listProductsDB, getProductDB, deleteProductDB } from "../models/product.js";

import { v4 as uuidv4 } from "uuid";

export async function createProductService(req) {
    req.body.unique_id = uuidv4();
    console.log("req:",req)

  return await createProductDB(req.body, req.user.id);
}

export async function updateProductService(req) {
  return await updateProductDB(req.body, req.user.id);
}

export async function listProductsService(req) {
  const { page = 1, limit = 10, sort = "asc", search = "" } = req.query;

  const pagination = {
    limit: Number(limit),
    offset: (page - 1) * limit,
    sort: sort === "desc" ? "DESC" : "ASC",
    search,
  };

  const data = await listProductsDB(pagination);

  return { status: true, data };
}

export async function getProductService(req) {
  const data = await getProductDB(req.params.unique_id);

  if (!data) return { status: false, message: "Product not found" };

  return { status: true, data };
}

export async function deleteProductService(req) {
  const result = await deleteProductDB(req.body.unique_id);

  if (result.affectedRows === 0) {
    return { status: false, message: "Product not found" };
  }

  return { status: true, message: "Product deleted" };
}
