import { createCategoryDB, updateCategoryDB, listCategoriesDB, getCategoryDB, deleteCategoryDB } from "../models/category.js";
import { v4 as uuidv4 } from "uuid";


export async function createCategoryService(req) {

  req.body.uuid = uuidv4();
  req.body.slug = req.body.name.toLowerCase().trim().replace(/\s+/g, "-");

  return await createCategoryDB(req.body, req.user.id);
}

export async function updateCategoryService(req) {
  if (!req.body.uuid) return { status: false, message: "UUID required" };

  await updateCategoryDB(req.body, req.user.id);
  return { status: true, message: "Category updated" };
}

export async function listCategoriesService() {
  return await listCategoriesDB();
}

export async function getCategoryService(uuid) {
  const data = await getCategoryDB(uuid);
  if (!data) return { status: false, message: "Category not found" };
  return data;
}

export async function deleteCategoryService(req) {
  if (!req.body.uuid) return { status: false, message: "UUID required" };

  const res = await deleteCategoryDB(req.body.uuid);

  return {
    status: true,
    deleted: res.affectedRows
  };
}
