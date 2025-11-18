import { verifyToken } from "../utils/jwt.js";

export function auth(req, res, next) {
    //   const token = req.headers.authorization?.split(" ")[1];
    const token = req.headers.authorization;


    if (!token) {
        return res.status(401).json({ message: "Token missing" });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }

    req.user = decoded;
    next();
}
