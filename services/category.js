import { createCategoryDB, updateCategoryDB, listCategoriesDB, getCategoryDB, deleteCategoryDB } from "../models/category.js";
import { v4 as uuidv4 } from "uuid";


export async function createCategoryService(req) {
  try {
    req.body.uuid = uuidv4();
    req.body.slug = req.body.name.toLowerCase().trim().replace(/\s+/g, "-");

    return await createCategoryDB(req.body, req.user.id);
  } catch (error) {
    console.log("error:", error)
    return {
      status: false,
      message: "Somthing went wrong",
      data: []
    };
  }
}

export async function updateCategoryService(req) {
  try {
    if (!req.body.uuid) return { status: false, message: "UUID required" };

    let data = await updateCategoryDB(req.body, req.user.id);
    if (data.affectedRows === 0) {
      return { status: false, message: "Category not found", data: [] };
    }

    return { status: true, message: "Category updated", data: [data] };

  } catch (error) {
    console.log("error:", error)
    return {
      status: false,
      message: "Somthing went wrong",
      data: []
    };
  }
}

export async function listCategoriesService() {
  try {
    return await listCategoriesDB();
  } catch (error) {
    console.log("error:", error)
    return {
      status: false,
      message: "Somthing went wrong",
      data: []
    };
  }
}

export async function getCategoryService(uuid) {
  try {
    const data = await getCategoryDB(uuid);
    if (!data) return { status: false, message: "Category not found" };
    return data;
  } catch (error) {
    console.log("error:", error)
    return {
      status: false,
      message: "Somthing went wrong",
      data: []
    };
  }
}

export async function deleteCategoryService(req) {
  try {
    if (!req.body.uuid) return { status: false, message: "UUID required" };

    const res = await deleteCategoryDB(req.body.uuid);
    if (res.affectedRows === 0) {
      return { status: false, message: "Category not found", data: [] };
    }

    return {
      status: true,
      deleted: res.affectedRows,
      message: "Category deleted"
    };
  } catch (error) {
    console.log("error:", error)
    return {
      status: false,
      message: "Somthing went wrong",
      data: []
    };
  }
}
