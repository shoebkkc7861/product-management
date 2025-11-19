import mysql from "../db/connnection.js";

export async function createProductDB(data, userId) {
  const {
    product_name,
    sku,
    image,
    price,
    category_id,
    stock,
    description,
    unique_id,
  } = data;

  try {
    const [res] = await mysql.execute(
      `INSERT INTO products 
      (product_name, sku, image, price, unique_id, category_id, stock, description, is_active, created_by, updated_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`,
      [
        product_name,
        sku,
        image,
        price,
        unique_id,
        category_id,
        stock,
        description,
        userId,
        userId,
      ]
    );

    return {
      status: true,
      message: "Product created",
      data: [{ insertId: res.insertId, unique_id }],
    };
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return { status: false, message: "SKU already exists", data: [] };
    }
    console.log("error:", error);
    return { status: false, message: "Something went wrong", data: [] };
  }
}

export async function updateProductDB(data, userId) {
  const { unique_id } = data;

  // dynamic update
  const fields = [];
  const values = [];

  const allowed = [
    "product_name",
    "sku",
    "image",
    "price",
    "category_id",
    "stock",
    "description",
    "is_active",
  ];

  for (let key of allowed) {
    if (data[key] !== undefined) {
      fields.push(`${key}=?`);
      values.push(data[key]);
    }
  }

  if (fields.length === 0) {
    return { status: false, message: "No fields to update", data: [] };
  }

  values.push(userId);
  values.push(unique_id);

  try {
    const [res] = await mysql.execute(
      `UPDATE products SET ${fields.join(", ")}, updated_by=?, updated_at=NOW() WHERE unique_id=?`,
      values
    );

    if (res.affectedRows === 0) {
      return { status: false, message: "Product not found", data: [] };
    }

    return { status: true, message: "Product updated", data: [] };
  } catch (error) {
    console.log("error:", error);
    return { status: false, message: "Something went wrong", data: [] };
  }
}

export async function listProductsDB(query) {
  const { limit, offset, sort, search } = query;

  const [rows] = await mysql.execute(
    `
    SELECT p.*, c.name AS category_name
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.product_name LIKE ? OR c.name LIKE ?
    ORDER BY p.price ${sort}
    LIMIT ? OFFSET ?
    `,
    [`%${search}%`, `%${search}%`, limit, offset]
  );

  return rows;
}

export async function getProductDB(unique_id) {
  const [rows] = await mysql.execute(
    `SELECT * FROM products WHERE unique_id=?`,
    [unique_id]
  );

  return rows.length ? rows[0] : null;
}

export async function deleteProductDB(unique_id) {
  const [res] = await mysql.execute(
    `UPDATE products SET is_active = 0 WHERE unique_id = ?`,
    [unique_id]
  );
  return res;
}

