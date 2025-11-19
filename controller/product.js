import {
  createProductService,
  updateProductService,
  listProductsService,
  getProductService,
  deleteProductService,
} from "../services/product.js";

export async function createProduct(req, res) {
  const result = await createProductService(req);
  return res.json(result);
}

export async function updateProduct(req, res) {
  const result = await updateProductService(req);
  return res.json(result);
}

export async function listProducts(req, res) {
  const result = await listProductsService(req);
  return res.json(result);
}

export async function getProduct(req, res) {
  const result = await getProductService(req);
  return res.json(result);
}

export async function deleteProduct(req, res) {
  const result = await deleteProductService(req);
  return res.json(result);
}
