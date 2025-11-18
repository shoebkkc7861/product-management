import { signUp, login, removeUser, modifyUser } from "../services/user.js";

export async function register(req, res) {
  const data = await signUp(req);
  return res.json(data);
}

export async function userLogin(req, res) {
  const data = await login(req);
  return res.json(data);
}

export async function deleteUser(req, res) {
  const data = await removeUser(req);
  return res.json(data);
}

export async function updateUser(req, res) {
  const data = await modifyUser(req);
  return res.json(data);
}
