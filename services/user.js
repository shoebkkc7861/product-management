import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { addUser, getUserByEmail, updateUser, deleteUser } from '../models/user.js';
import dotenv from 'dotenv'
import { generateToken } from '../utils/jwt.js';

dotenv.config()

export async function signUp(req) {

    let { password, email, phone } = req.body;
    console.log("body:", req.body)

    const existing = await getUserByEmail(email, phone);
    if (existing.length > 0) {
        return { status: false, message: "Email or Phone number already exists" };
    }

    const hash = await bcrypt.hash(password, 10);
    req.body.password = hash;

    let user = await addUser(req.body);
    // console.log("user:", user)

    const token = generateToken({
        id: user.insertedId,
        email
    });

    return {
        status: true,
        message: "Signup success",
        token
    };
}

export async function login(req) {
    const { emailOrPhone, password } = req.body;

    const [user] = await getUserByEmail(emailOrPhone);

    if (!user) {
        return { status: false, message: "User not found" };
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return { status: false, message: "Wrong password" };
    }

    const token = generateToken({
        id: user.id,
        email: user.email
    });

    return {
        status: true,
        message: "Login success",
        token
    };
}


export async function removeUser(req) {
    if (req.user.email !== req.body.email) {
        return { status: false, message: "You are not allowed" };
    }

      const result = await deleteUser(req.body.email);

    return {
        status: true,
        message: "User deleted",
        affected: result.affectedRows
    };
}

export async function modifyUser(req) {
    if (req.user.email !== req.body.email) {
        return { status: false, message: "You are not allowed" };
    }

    const result = await updateUser(req.body);

    return {
        status: true,
        message: "User updated",
        affected: result.affectedRows
    };
}

