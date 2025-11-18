import mysql from "mysql2/promise"
import dotenv from "dotenv"
dotenv.config()

const pool = mysql.createPool({
    host:process.env.DB_HOST,
    port:process.env.DB_PORT,
    user:process.env.DB_USER,
    password:process.env.DB_PASS,
    waitForConnections:true,
    queueLimit:0,
    connectionLimit:10,
    database:"product_management"
})

// console.log(pool)
export default pool;