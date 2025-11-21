import { signUp, login, removeUser, modifyUser, activateUser } from "../services/user.js";

export async function register(req, res) {
  try {
    const data = await signUp(req);
    return res.json(data);
  } catch (error) {
    console.log("error:", error)
    return {
      status: false,
      message: "Somthing went wrong",
      data: []
    };
  }
}

export async function userLogin(req, res) {
  const data = await login(req);
  return res.json(data);
}

export async function deactivateUser(req, res) {
  const data = await removeUser(req);
  return res.json(data);
}

export async function activateUserController(req, res) {
  const data = await activateUser(req);
  return res.json(data);
}

export async function updateUser(req, res) {
  const data = await modifyUser(req);
  return res.json(data);
}
