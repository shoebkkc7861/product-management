import mysql from '../db/connnection.js';

export const addUser = async (userData) => {
  try {
    const {
      first_name,
      last_name,
      email,
      phone,
      password,
      gender,
      dob,
      city,
      state,
      pincode
    } = userData;

    const [result] = await mysql.execute(
      `
            INSERT INTO users 
            (first_name, last_name, email, phone, password, gender, dob, city, state, pincode)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
      [
        first_name,
        last_name,
        email,
        phone,
        password,
        gender,
        dob,
        city,
        state,
        pincode
      ]
    );

    return { insertedId: result.insertId };

  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getUserByEmail = async (emailOrPhone) => {
  try {
    const [rows] = await mysql.execute(
      `SELECT * FROM users WHERE email = ? or phone = ?`,
      [emailOrPhone, emailOrPhone]
    );

    return { status: true, message: `${(rows.length > 0) ? "data found" : "data not found"}`, data: rows };

  } catch (error) {
    return { status: false, message: "Somthing went wrong", data: [] };

  }

  // return rows;
};

export const updateUser = async (data) => {
  const allowedFields = [
    "first_name",
    "last_name",
    "city",
    "state",
    "pincode",
    "dob",
    "phone"
  ];

  const updates = [];
  const values = [];

  for (const key of allowedFields) {
    if (data[key] !== undefined && data[key] !== null && data[key] !== "") {
      updates.push(`${key} = ?`);
      values.push(data[key]);
    }
  }

  if (updates.length === 0) {
    return { affectedRows: 0, message: "Nothing to update" };
  }

  values.push(data.email);

  const query = `
      UPDATE users SET ${updates.join(", ")}
      WHERE email = ?
  `;

  const [res] = await mysql.execute(query, values);
  return res;
};


export const deleteUser = async (email) => {
    const [res] = await mysql.execute(
    `UPDATE users SET is_active = 0 WHERE email = ?`,
    [email]
  );
  return res;
};