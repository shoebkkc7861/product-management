import { verifyToken } from "../utils/jwt.js";
import mysql from "../db/connnection.js";

export async function auth(req, res, next) {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) return res.status(401).json({ message: "Token missing" });

        const decoded = verifyToken(token);
        if (!decoded) return res.status(401).json({ message: "Invalid or expired token" });

        const userId = decoded.id;
        if (!userId) {
            req.user = decoded;
            return next();
        }

        const [rows] = await mysql.execute("SELECT is_active FROM users WHERE id = ? LIMIT 1", [userId]);
        const userRow = rows && rows[0] ? rows[0] : null;

        if (userRow && Number(userRow.is_active) === 0) {
            return res.status(403).json({ status: false, message: "Account inactive. No permission to perform this action." });
        }

        req.user = decoded;
        return next();
    } catch (err) {
        console.error("auth middleware error:", err);
        return res.status(500).json({ status: false, message: "Authentication error" });
    }
}
