import mysql from "../db/connnection.js";

export async function createCategoryDB({ name, description, slug, uuid }, userId) {

  try {
    const [res] = await mysql.execute(
      `INSERT INTO categories 
    (name, slug, uuid, description, created_by, updated_by)
     VALUES (?, ?, ?, ?, ?, ?)`,
      [name, slug, uuid, description, userId, userId]
    );

    // console.log(res)

    return { status: true, message: "Category created", data: [{ insertId: res.insertId, uuid }] };
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return { status: false, message: "Slug already exists", data: [] };
    }
    console.log("error:",error)
    return { status: false, message: "Somthing went wrong", data: [] };

  }

}


export async function updateCategoryDB({ uuid, name, description }, userId) {
  try {
    let fields = [];
    let values = [];

    if (name) {
      fields.push("name=?");
      values.push(name);
      fields.push("slug=?");
      values.push(name.toLowerCase().trim().replace(/\s+/g, "-"));
    }

    if (description) {
      fields.push("description=?");
      values.push(description);
    }

    fields.push("updated_by=?");
    values.push(userId);

    values.push(uuid);

    const [res] = await mysql.execute(
      `UPDATE categories SET ${fields.join(", ")} WHERE uuid=?`,
      values
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


export async function listCategoriesDB() {
  try {
    const [rows] = await mysql.execute(`SELECT * FROM categories ORDER BY id DESC`);
    return rows;
  } catch (error) {
    console.log("error:", error)
        return {
            status: false,
            message: "Somthing went wrong",
            data: []
        };
  }
}


export async function getCategoryDB(uuid) {
  try {
    const [rows] = await mysql.execute(`SELECT * FROM categories WHERE uuid=?`, [uuid]);
    return rows[0];
  } catch (error) {
    console.log("error:", error)
        return {
            status: false,
            message: "Somthing went wrong",
            data: []
        };
  }
}

export async function getCategoryBySlug(slug) {
  try {
    const [rows] = await mysql.execute(`SELECT * FROM categories WHERE slug=?`, [slug]);
    return rows[0];
  } catch (error) {
    console.log("error:", error)
        return {
            status: false,
            message: "Somthing went wrong",
            data: []
        };
  }
}

export async function deleteCategoryDB(uuid) {
  try {
    const [res] = await mysql.execute(
      `UPDATE categories SET is_active = 0 WHERE uuid = ?`,
      [uuid]
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

