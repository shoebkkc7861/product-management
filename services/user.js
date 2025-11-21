import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { addUser, getUserByEmail, updateUser, deleteUser, activateUserDB } from '../models/user.js';
import dotenv from 'dotenv'
import { generateToken } from '../utils/jwt.js';

dotenv.config()

export async function signUp(req) {

    try {
        let { password, email, phone } = req.body;
        // console.log("body:", req.body)

        const existing = await getUserByEmail(email, phone);
        if (existing.data.length > 0) {
            return { status: false, message: "Email or Phone number already exists" };
        }else if (!existing.status){
            return existing
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
            data: [{ token }]
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

export async function login(req) {

    try {
        const { emailOrPhone, password } = req.body;

        const lookup = await getUserByEmail(emailOrPhone);
        let user;
        if (lookup && Array.isArray(lookup.data)) {
            user = lookup.data[0];
        } else if (Array.isArray(lookup)) {
            user = lookup[0];
        } else if (lookup && lookup.status === false) {
            return lookup;
        } else {
            user = lookup;
        }

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
            data: [{ token }]
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


export async function removeUser(req) {
    try {
        if (req.user.email !== req.body.email) {
            return { status: false, message: "You are not allowed" };
        }

        const result = await deleteUser(req.body.email);

        return {
            status: true,
            message: "User deleted",
            data: [{ affected: result.affectedRows }]
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

export async function activateUser(req) {
    try {
        const { email, password } = req.body;
        if (!email || !password) return { status: false, message: "Email and password required" };

        const lookup = await getUserByEmail(email);
        let user;
        if (lookup && Array.isArray(lookup.data)) user = lookup.data[0];
        else if (Array.isArray(lookup)) user = lookup[0];
        else user = lookup;

        if (!user) return { status: false, message: "User not found" };

        const match = await bcrypt.compare(password, user.password);
        if (!match) return { status: false, message: "Wrong user or password" };

        const res = await activateUserDB(email);
        return { status: true, message: "User activated", data: [{ affected: res.affectedRows }] };
    } catch (error) {
        console.log("activateUser error:", error);
        return { status: false, message: "Somthing went wrong", data: [] };
    }
}

export async function modifyUser(req) {
    try {
        if (req.user.email !== req.body.email) {
            return { status: false, message: "You are not allowed" };
        }

        const result = await updateUser(req.body);

        return {
            status: true,
            message: "User updated",
            data: [{ affected: result.affectedRows }]
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

