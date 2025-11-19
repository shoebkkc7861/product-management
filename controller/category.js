import {
  createCategoryService,
  updateCategoryService,
  listCategoriesService,
  getCategoryService,
  deleteCategoryService
} from "../services/category.js";


export async function createCategory(req, res) {
  const result = await createCategoryService(req);
  return res.json( result );
}

export async function updateCategory(req, res) {
  const result = await updateCategoryService(req);
  return res.json(result);
}

export async function listCategories(req, res) {
  const data = await listCategoriesService();
  return res.json(data);
}

export async function getCategory(req, res) {
  const result = await getCategoryService(req.params.uuid);
  return res.json(result);
}

export async function deleteCategory(req, res) {
  const result = await deleteCategoryService(req);
  return res.json(result);
}
